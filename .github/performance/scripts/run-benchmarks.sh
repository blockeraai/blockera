#!/usr/bin/env bash
# Run wpp-research benchmark-server-timing with Blockera on, then off.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

OUT_DIR="${PERF_RESULTS_DIR:-.github/performance/results}"
SCENARIOS_FILE="${SCENARIOS_FILE:-.github/performance/scenarios.json}"
RESOLVED_FILE="${OUT_DIR}/resolved-scenarios.json"
WPP_DIR="${WPP_RESEARCH_DIR:-${OUT_DIR}/wpp-research}"
# Pin for reproducibility; bump intentionally when upgrading the tool.
WPP_REF="${WPP_RESEARCH_REF:-main}"
BLOCKERA_PLUGIN="blockera/blockera.php"

mkdir -p "$OUT_DIR"

REQUESTS="$(node -e "const s=require('./${SCENARIOS_FILE}'); process.stdout.write(String(s.defaults.requests || 200))")"
CONCURRENCY="$(node -e "const s=require('./${SCENARIOS_FILE}'); process.stdout.write(String(s.defaults.concurrency || 1))")"

URLS_FILE="${OUT_DIR}/urls.txt"
URLS_WITHOUT_FILE="${OUT_DIR}/urls-without-blockera.txt"

# Resolve URL list paths to absolute so wpp-research (cwd = WPP_DIR) always reads the right file.
abs_path() {
	local p="$1"
	if [[ "$p" = /* ]]; then
		printf '%s' "$p"
	else
		printf '%s/%s' "$ROOT_DIR" "$p"
	fi
}

URLS_FILE_ABS="$(abs_path "$URLS_FILE")"
URLS_WITHOUT_FILE_ABS="$(abs_path "$URLS_WITHOUT_FILE")"

if [[ ! -f "$URLS_FILE_ABS" ]]; then
	echo "Error: ${URLS_FILE_ABS} missing. Run setup-content.sh first."
	exit 1
fi

if [[ ! -f "$RESOLVED_FILE" ]]; then
	echo "Error: ${RESOLVED_FILE} missing. Run setup-content.sh first."
	exit 1
fi

# Exclude requiresBlockera scenarios from the core-only run (warm-up + benchmark).
RESOLVED_FILE_ABS="$(abs_path "$RESOLVED_FILE")"
export RESOLVED_FILE_ABS URLS_WITHOUT_FILE_ABS
node <<'NODE'
const fs = require('fs');
const resolved = JSON.parse(fs.readFileSync(process.env.RESOLVED_FILE_ABS, 'utf8'));
const urls = [];
for (const scenario of resolved.scenarios || []) {
	if (scenario.requiresBlockera) {
		continue;
	}
	if (scenario.url) {
		urls.push(scenario.url);
	}
}
if (!urls.length) {
	console.error('Error: no URLs left after filtering requiresBlockera scenarios.');
	process.exit(1);
}
fs.writeFileSync(process.env.URLS_WITHOUT_FILE_ABS, urls.join('\n') + '\n');
console.log(
	'Wrote ' + process.env.URLS_WITHOUT_FILE_ABS + ' (' + urls.length + ' URLs, skipped requiresBlockera)'
);
NODE

if [[ ! -d "$WPP_DIR/.git" ]]; then
	echo "Cloning GoogleChromeLabs/wpp-research (${WPP_REF})..."
	rm -rf "$WPP_DIR"
	git clone --depth 1 --branch "$WPP_REF" https://github.com/GoogleChromeLabs/wpp-research.git "$WPP_DIR"
else
	echo "Using existing wpp-research at ${WPP_DIR}"
fi

if [[ ! -d "$WPP_DIR/node_modules" ]]; then
	echo "Installing wpp-research dependencies..."
	(cd "$WPP_DIR" && npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts)
fi

# Ensure WP-CLI and the web container agree on Blockera's active state.
assert_blockera_cli_state() {
	local expect="$1" # "1" active, "0" inactive
	local active_plugins is_active=0

	active_plugins="$(npx wp-env run cli -- wp option get active_plugins --format=json 2>/dev/null | tr -d '\r' || true)"
	if [[ "$active_plugins" == *"${BLOCKERA_PLUGIN}"* ]]; then
		is_active=1
	fi

	echo "CLI active_plugins contains ${BLOCKERA_PLUGIN}: ${is_active} (expect ${expect})"
	printf '%s\n' "${active_plugins:-[]}" > "${OUT_DIR}/active-plugins-${expect}.json"

	if [[ "$is_active" != "$expect" ]]; then
		echo "Error: WP-CLI Blockera state mismatch (expected ${expect}, got ${is_active})."
		npx wp-env run cli -- wp plugin list --status=active --fields=name,status || true
		exit 1
	fi
}

# One GET per URL to trigger first-request side effects before measuring.
# Fails the job on any non-2xx or X-Blockera-Perf-Active mismatch.
warmup_urls() {
	local urls_file="$1"
	local expect_active="$2" # "1" or "0"
	local failed=0
	local url code header_active hdr_file

	echo "=== Warm-up (1 request per URL from ${urls_file}; expect X-Blockera-Perf-Active=${expect_active}) ==="
	while IFS= read -r url || [[ -n "${url:-}" ]]; do
		[[ -z "${url// }" || "$url" =~ ^# ]] && continue

		hdr_file="$(mktemp)"
		code="$(curl -sS -D "$hdr_file" -o /dev/null -w '%{http_code}' --max-time 120 "$url" || echo "000")"
		header_active="$(
			tr -d '\r' < "$hdr_file" | awk -F': ' 'tolower($1) == "x-blockera-perf-active" { print $2; exit }'
		)"
		rm -f "$hdr_file"

		echo "  warm-up ${code} active=${header_active:-<missing>} ${url}"

		if [[ ! "$code" =~ ^2[0-9][0-9]$ ]]; then
			echo "Error: warm-up failed for ${url} (HTTP ${code})"
			failed=1
			continue
		fi

		if [[ "$header_active" != "$expect_active" ]]; then
			echo "Error: ${url} returned X-Blockera-Perf-Active='${header_active:-<missing>}' (expected ${expect_active})."
			echo "This usually means activate/deactivate did not apply to the web container serving localhost:8888."
			failed=1
		fi
	done < "$urls_file"

	if [[ "$failed" -ne 0 ]]; then
		echo "Error: warm-up had failures; aborting benchmark."
		exit 1
	fi
	echo "Warm-up complete."
}

run_bench() {
	local label="$1"
	local outfile="$2"
	local urls_file_abs="$3"

	echo "=== Benchmark (${label}): n=${REQUESTS} c=${CONCURRENCY} urls=${urls_file_abs} ==="
	(
		cd "$WPP_DIR"
		npm run research -- benchmark-server-timing \
			-f "$urls_file_abs" \
			-n "$REQUESTS" \
			-c "$CONCURRENCY" \
			-o csv
	) | tee "$outfile"

	echo "Wrote ${outfile}"
}

echo "Ensuring Blockera is active..."
npx wp-env run cli -- wp plugin activate blockera
assert_blockera_cli_state "1"
warmup_urls "$URLS_FILE_ABS" "1"
run_bench "with-blockera" "${OUT_DIR}/with.csv" "$URLS_FILE_ABS"

echo "Deactivating Blockera..."
npx wp-env run cli -- wp plugin deactivate blockera
assert_blockera_cli_state "0"
warmup_urls "$URLS_WITHOUT_FILE_ABS" "0"
run_bench "without-blockera" "${OUT_DIR}/without.csv" "$URLS_WITHOUT_FILE_ABS"

echo "Re-activating Blockera for a consistent env end-state..."
npx wp-env run cli -- wp plugin activate blockera || true

echo "Benchmarks complete."

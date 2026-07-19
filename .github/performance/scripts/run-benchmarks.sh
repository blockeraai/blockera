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

mkdir -p "$OUT_DIR"

REQUESTS="$(node -e "const s=require('./${SCENARIOS_FILE}'); process.stdout.write(String(s.defaults.requests || 200))")"
CONCURRENCY="$(node -e "const s=require('./${SCENARIOS_FILE}'); process.stdout.write(String(s.defaults.concurrency || 1))")"

URLS_FILE="${OUT_DIR}/urls.txt"
URLS_WITHOUT_FILE="${OUT_DIR}/urls-without-blockera.txt"

if [[ ! -f "$URLS_FILE" ]]; then
	echo "Error: ${URLS_FILE} missing. Run setup-content.sh first."
	exit 1
fi

if [[ ! -f "$RESOLVED_FILE" ]]; then
	echo "Error: ${RESOLVED_FILE} missing. Run setup-content.sh first."
	exit 1
fi

# Exclude requiresBlockera scenarios from the core-only run (warm-up + benchmark).
node <<NODE
const fs = require('fs');
const resolved = JSON.parse(fs.readFileSync('${RESOLVED_FILE}', 'utf8'));
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
fs.writeFileSync('${URLS_WITHOUT_FILE}', urls.join('\n') + '\n');
console.log('Wrote ${URLS_WITHOUT_FILE} (' + urls.length + ' URLs, skipped requiresBlockera)');
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

# One GET per URL to trigger first-request side effects before measuring.
# Fails the job on any non-2xx so broken URLs never enter the benchmark.
warmup_urls() {
	local urls_file="$1"
	local failed=0
	local url code

	echo "=== Warm-up (1 request per URL from ${urls_file}) ==="
	while IFS= read -r url || [[ -n "${url:-}" ]]; do
		[[ -z "${url// }" || "$url" =~ ^# ]] && continue
		code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 120 "$url" || echo "000")"
		echo "  warm-up ${code} ${url}"
		if [[ ! "$code" =~ ^2[0-9][0-9]$ ]]; then
			echo "Error: warm-up failed for ${url} (HTTP ${code})"
			failed=1
		fi
	done < "$urls_file"

	if [[ "$failed" -ne 0 ]]; then
		echo "Error: warm-up had non-2xx responses; aborting benchmark."
		exit 1
	fi
	echo "Warm-up complete."
}

run_bench() {
	local label="$1"
	local outfile="$2"
	local urls_file="$3"

	echo "=== Benchmark (${label}): n=${REQUESTS} c=${CONCURRENCY} ==="
	(
		cd "$WPP_DIR"
		npm run research -- benchmark-server-timing \
			-f "${ROOT_DIR}/${urls_file}" \
			-n "$REQUESTS" \
			-c "$CONCURRENCY" \
			-o csv
	) | tee "$outfile"

	echo "Wrote ${outfile}"
}

echo "Ensuring Blockera is active..."
npx wp-env run cli -- wp plugin activate blockera
warmup_urls "$URLS_FILE"
run_bench "with-blockera" "${OUT_DIR}/with.csv" "$URLS_FILE"

echo "Deactivating Blockera..."
npx wp-env run cli -- wp plugin deactivate blockera
warmup_urls "$URLS_WITHOUT_FILE"
run_bench "without-blockera" "${OUT_DIR}/without.csv" "$URLS_WITHOUT_FILE"

echo "Re-activating Blockera for a consistent env end-state..."
npx wp-env run cli -- wp plugin activate blockera || true

echo "Benchmarks complete."

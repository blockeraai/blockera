#!/usr/bin/env bash
# Run wpp-research benchmark-server-timing with Blockera on, then off.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

OUT_DIR="${PERF_RESULTS_DIR:-.github/performance/results}"
SCENARIOS_FILE="${SCENARIOS_FILE:-.github/performance/scenarios.json}"
WPP_DIR="${WPP_RESEARCH_DIR:-${OUT_DIR}/wpp-research}"
# Pin for reproducibility; bump intentionally when upgrading the tool.
WPP_REF="${WPP_RESEARCH_REF:-main}"

mkdir -p "$OUT_DIR"

REQUESTS="$(node -e "const s=require('./${SCENARIOS_FILE}'); process.stdout.write(String(s.defaults.requests || 200))")"
CONCURRENCY="$(node -e "const s=require('./${SCENARIOS_FILE}'); process.stdout.write(String(s.defaults.concurrency || 1))")"

URLS_FILE="${OUT_DIR}/urls.txt"
if [[ ! -f "$URLS_FILE" ]]; then
	echo "Error: ${URLS_FILE} missing. Run setup-content.sh first."
	exit 1
fi

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

run_bench() {
	local label="$1"
	local outfile="$2"

	echo "=== Benchmark (${label}): n=${REQUESTS} c=${CONCURRENCY} ==="
	(
		cd "$WPP_DIR"
		npm run research -- benchmark-server-timing \
			-f "${ROOT_DIR}/${URLS_FILE}" \
			-n "$REQUESTS" \
			-c "$CONCURRENCY" \
			-o csv
	) | tee "$outfile"

	echo "Wrote ${outfile}"
}

echo "Ensuring Blockera is active..."
npx wp-env run cli -- wp plugin activate blockera
run_bench "with-blockera" "${OUT_DIR}/with.csv"

echo "Deactivating Blockera..."
npx wp-env run cli -- wp plugin deactivate blockera
run_bench "without-blockera" "${OUT_DIR}/without.csv"

echo "Re-activating Blockera for a consistent env end-state..."
npx wp-env run cli -- wp plugin activate blockera || true

echo "Benchmarks complete."

#!/usr/bin/env bash
# Run Playwright performance suite with Blockera on, then off.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

OUT_DIR="${PERF_RESULTS_DIR:-.github/performance/results}"
ARTIFACTS_DIR="${WP_ARTIFACTS_PATH:-${ROOT_DIR}/artifacts}"

export WP_BASE_URL="${WP_BASE_URL:-http://localhost:8888}"
export WP_ARTIFACTS_PATH="${ARTIFACTS_DIR}"
export PERF_RESULTS_DIR="${OUT_DIR}"
export TEST_RUNS="${TEST_RUNS:-20}"

mkdir -p "$OUT_DIR" "$ARTIFACTS_DIR"

if [[ ! -f "${OUT_DIR}/resolved-scenarios.json" ]]; then
	echo "Error: ${OUT_DIR}/resolved-scenarios.json missing. Run setup-content.sh first."
	exit 1
fi

run_subject() {
	local subject="$1"
	local prefix="$2"

	echo "=== Playwright performance: subject=${subject} prefix=${prefix} ==="
	PERF_SUBJECT="${subject}" \
		TEST_RESULTS_PREFIX="${prefix}" \
		npm run test:performance
}

echo "Ensuring Blockera is active..."
npx wp-env run cli -- wp plugin activate blockera
run_subject "blockera" "blockera"

echo "Deactivating Blockera..."
npx wp-env run cli -- wp plugin deactivate blockera
run_subject "core" "core"

echo "Re-activating Blockera for a consistent env end-state..."
npx wp-env run cli -- wp plugin activate blockera || true

echo "Benchmarks complete."
echo "Artifacts:"
ls -la "${ARTIFACTS_DIR}"/*performance-results.json 2>/dev/null || true

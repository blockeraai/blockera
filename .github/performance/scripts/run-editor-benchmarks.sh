#!/usr/bin/env bash
# Run Playwright block-editor performance suite with Blockera on, then off.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

OUT_DIR="${PERF_RESULTS_DIR:-.github/performance/results}"
ARTIFACTS_DIR="${WP_ARTIFACTS_PATH:-${ROOT_DIR}/artifacts}"

export WP_BASE_URL="${WP_BASE_URL:-http://localhost:8888}"
export WP_ARTIFACTS_PATH="${ARTIFACTS_DIR}"
export PERF_RESULTS_DIR="${OUT_DIR}"

mkdir -p "$OUT_DIR" "$ARTIFACTS_DIR"

run_subject() {
	local subject="$1"
	local prefix="$2"

	echo "=== Playwright editor performance: subject=${subject} prefix=${prefix} ==="
	PERF_SUBJECT="${subject}" \
		TEST_RESULTS_PREFIX="${prefix}" \
		npm run test:performance:editor
}

echo "Ensuring Blockera is active..."
npx wp-env run cli -- wp plugin activate blockera
run_subject "blockera" "blockera-editor"

echo "Deactivating Blockera..."
npx wp-env run cli -- wp plugin deactivate blockera
run_subject "core" "core-editor"

echo "Re-activating Blockera for a consistent env end-state..."
npx wp-env run cli -- wp plugin activate blockera || true

echo "Editor benchmarks complete."
echo "Artifacts:"
ls -la "${ARTIFACTS_DIR}"/*editor-performance-results.json 2>/dev/null || true

#!/usr/bin/env bash
# Run Playwright block-editor performance suite for the current checkout,
# optionally against a Core (plugin-off) baseline.
#
# PERF_BASELINE:
#   core     — Blockera on, then Core off (default; PR vs WordPress Core)
#   current  — Blockera on only (used when a separate job step collects master)
#
# PERF_SCENARIO_SCOPE (forwarded to Playwright):
#   all | core-comparable | blockera-only
#
# Artifact prefixes (under WP_ARTIFACTS_PATH):
#   PERF_CURRENT_PREFIX   default: blockera-editor
#   PERF_BASELINE_PREFIX  default: core-editor (core baseline only)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

OUT_DIR="${PERF_RESULTS_DIR:-.github/performance/results}"
ARTIFACTS_DIR="${WP_ARTIFACTS_PATH:-${ROOT_DIR}/artifacts}"
PERF_BASELINE="${PERF_BASELINE:-core}"
PERF_SCENARIO_SCOPE="${PERF_SCENARIO_SCOPE:-all}"
CURRENT_PREFIX="${PERF_CURRENT_PREFIX:-blockera-editor}"
BASELINE_PREFIX="${PERF_BASELINE_PREFIX:-core-editor}"

export WP_BASE_URL="${WP_BASE_URL:-http://localhost:8888}"
export WP_ARTIFACTS_PATH="${ARTIFACTS_DIR}"
export PERF_RESULTS_DIR="${OUT_DIR}"
export PERF_SCENARIO_SCOPE

mkdir -p "$OUT_DIR" "$ARTIFACTS_DIR"

run_subject() {
	local subject="$1"
	local prefix="$2"

	echo "=== Playwright editor performance: subject=${subject} prefix=${prefix} baseline=${PERF_BASELINE} scope=${PERF_SCENARIO_SCOPE} ==="
	PERF_SUBJECT="${subject}" \
		TEST_RESULTS_PREFIX="${prefix}" \
		PERF_SCENARIO_SCOPE="${PERF_SCENARIO_SCOPE}" \
		npm run test:performance:editor
}

echo "Ensuring Blockera is active..."
npx wp-env run cli -- wp plugin activate blockera
run_subject "blockera" "${CURRENT_PREFIX}"

case "${PERF_BASELINE}" in
	core)
		echo "Deactivating Blockera for Core baseline..."
		npx wp-env run cli -- wp plugin deactivate blockera
		run_subject "core" "${BASELINE_PREFIX}"

		echo "Re-activating Blockera for a consistent env end-state..."
		npx wp-env run cli -- wp plugin activate blockera || true
		;;
	current|master)
		# Master baseline is collected in a separate workflow step after
		# checking out origin/master (same machine, rebuilt plugin).
		echo "PERF_BASELINE=${PERF_BASELINE}: skipped in-env Core subject."
		;;
	*)
		echo "Error: unknown PERF_BASELINE='${PERF_BASELINE}' (expected: core, current, master)"
		exit 1
		;;
esac

echo "Editor benchmarks complete."
echo "Artifacts:"
ls -la "${ARTIFACTS_DIR}"/*editor-performance-results.json 2>/dev/null || true

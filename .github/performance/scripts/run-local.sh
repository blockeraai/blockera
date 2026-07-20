#!/usr/bin/env bash
# Local Core vs Blockera Playwright performance compare.
#
# Usage:
#   npm run test:performance:local
#   npm run test:performance:local -- --runs=10 --skip-build --skip-env-start --base-url=http://localhost:8888
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

# Defaults (env vars still work as overrides before flags).
WP_BASE_URL="${WP_BASE_URL:-http://localhost:8888}"
WP_ARTIFACTS_PATH="${WP_ARTIFACTS_PATH:-${ROOT_DIR}/artifacts}"
PERF_RESULTS_DIR="${PERF_RESULTS_DIR:-.github/performance/results}"
TEST_RUNS="${TEST_RUNS:-5}"
SKIP_ENV_START="${SKIP_ENV_START:-}"
SKIP_BUILD="${SKIP_BUILD:-}"
FORCE_ENV_RESTART="${FORCE_ENV_RESTART:-}"

usage() {
	cat <<'EOF'
Usage: npm run test:performance:local -- [options]

Options:
  --runs=N              Iterations per scenario (default: 5)
  --skip-build          Skip npm run build
  --skip-env-start      Do not start/restart wp-env (must already be up with perf config)
  --force-env-restart   Stop and start wp-env so performance.json mappings apply
  --base-url=URL        WordPress base URL (default: http://localhost:8888)
  -h, --help            Show this help

Example (all flags):
  npm run test:performance:local -- --runs=10 --skip-build --skip-env-start --base-url=http://localhost:8888

Example (fix stale env missing Server-Timing):
  npm run test:performance:local -- --skip-build --force-env-restart
EOF
}

for arg in "$@"; do
	case "$arg" in
		--)
			# Ignore npm's option separator when forwarded.
			;;
		--runs=*)
			TEST_RUNS="${arg#*=}"
			;;
		--skip-build)
			SKIP_BUILD=1
			;;
		--skip-env-start)
			SKIP_ENV_START=1
			;;
		--force-env-restart)
			FORCE_ENV_RESTART=1
			;;
		--base-url=*)
			WP_BASE_URL="${arg#*=}"
			;;
		-h|--help)
			usage
			exit 0
			;;
		*)
			echo "Unknown option: ${arg}"
			usage
			exit 1
			;;
	esac
done

export WP_BASE_URL
export WP_ARTIFACTS_PATH
export PERF_RESULTS_DIR
export TEST_RUNS

echo "=== Blockera local performance benchmark ==="
echo "WP_BASE_URL=${WP_BASE_URL}"
echo "TEST_RUNS=${TEST_RUNS}"
echo "SKIP_BUILD=${SKIP_BUILD:-0}"
echo "SKIP_ENV_START=${SKIP_ENV_START:-0}"
echo "FORCE_ENV_RESTART=${FORCE_ENV_RESTART:-0}"
echo "PERF_RESULTS_DIR=${PERF_RESULTS_DIR}"
echo "WP_ARTIFACTS_PATH=${WP_ARTIFACTS_PATH}"

cp .github/wp-env-configs/performance.json .wp-env.json

wait_for_wp() {
	echo "Waiting for WordPress..."
	for i in $(seq 1 36); do
		if curl -sf -o /dev/null "${WP_BASE_URL}"; then
			echo "WordPress is ready."
			return 0
		fi
		echo "Attempt ${i}/36 — waiting 5s..."
		sleep 5
	done
	echo "Error: WordPress not reachable at ${WP_BASE_URL}"
	return 1
}

# True when perf MU-plugins + constant are active in the running environment.
perf_env_ready() {
	local header
	header="$(curl -sD - -o /dev/null "${WP_BASE_URL}/?rnd=${RANDOM}" 2>/dev/null || true)"
	if echo "${header}" | grep -qi 'server-timing'; then
		return 0
	fi
	return 1
}

# Always start via setup-wp-env.js with WP_ENV_CONFIG=performance.
# Plain `npm run env:start` reads .env (often base/development) and overwrites
# the performance.json copy we just wrote.
start_perf_env() {
	echo "Starting wp-env with WP_ENV_CONFIG=performance..."
	WP_ENV_CONFIG=performance npm run env:start
}

start_or_restart_env() {
	local reason="${1:-}"
	if [[ -n "${reason}" ]]; then
		echo "${reason}"
	fi
	echo "Restarting wp-env so performance.json (MU-plugins + BLOCKERA_PERF_BENCHMARK) applies..."
	npx wp-env stop || true
	start_perf_env
}

if [[ -n "${FORCE_ENV_RESTART}" ]]; then
	if [[ -n "${SKIP_ENV_START}" ]]; then
		echo "Error: --force-env-restart cannot be combined with --skip-env-start."
		exit 1
	fi
	start_or_restart_env
elif [[ -z "${SKIP_ENV_START}" ]]; then
	if curl -sf -o /dev/null "${WP_BASE_URL}"; then
		echo "WordPress already reachable at ${WP_BASE_URL}."
		if ! perf_env_ready; then
			start_or_restart_env "Perf Server-Timing not detected on running env (stale wp-env without performance.json mappings)."
		else
			echo "Perf Server-Timing already present (reusing env)."
		fi
	else
		start_perf_env
	fi
else
	echo "SKIP_ENV_START set; not starting wp-env."
fi

wait_for_wp

if ! perf_env_ready; then
	echo "Error: Server-Timing still missing after env start."
	echo "Ensure performance config is applied (setup-wp-env.js must not overwrite it with base/development):"
	echo "  npx wp-env stop && WP_ENV_CONFIG=performance npm run env:start"
	echo "Or re-run: npm run test:performance:local -- --skip-build --force-env-restart"
	exit 1
fi
echo "Server-Timing header confirmed."

if [[ -z "${SKIP_BUILD}" ]]; then
	echo "Building plugin assets..."
	npm run build
else
	echo "SKIP_BUILD set; skipping npm run build."
fi

if ! npx playwright --version >/dev/null 2>&1; then
	echo "Error: Playwright CLI not available."
	exit 1
fi

echo "Ensuring Chromium is installed..."
npx playwright install chromium

bash .github/performance/scripts/setup-server-timing.sh
bash .github/performance/scripts/setup-content.sh
bash .github/performance/scripts/run-benchmarks.sh

echo "Comparing results..."
set +e
node tests/performance/compare-results.js
COMPARE_CODE=$?
set -e

REPORT="${PERF_RESULTS_DIR}/report.md"
if [[ -f "$REPORT" ]]; then
	echo ""
	echo "=== Report: ${REPORT} ==="
	cat "$REPORT"
else
	echo "Warning: report not found at ${REPORT}"
fi

exit "${COMPARE_CODE}"

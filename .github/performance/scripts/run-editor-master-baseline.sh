#!/usr/bin/env bash
# Build Blockera from origin/master in an isolated git worktree, point wp-env at
# that plugin directory, then run the PR checkout's editor performance harness.
#
# Why a worktree (not `git checkout master`):
# - master may not yet contain tests/performance or package.json scripts
# - Gutenberg-style: same tests/tooling from the PR, only the plugin under test differs
#
# Prerequisites: already on the PR checkout with deps installed, Chromium ready,
# and PR Blockera editor artifacts already collected (blockera-editor-*).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

OUT_DIR="${PERF_RESULTS_DIR:-.github/performance/results}"
ARTIFACTS_DIR="${WP_ARTIFACTS_PATH:-${ROOT_DIR}/artifacts}"
PERF_SCENARIO_SCOPE="${PERF_SCENARIO_SCOPE:-blockera-only}"
MASTER_REF="${PERF_MASTER_REF:-origin/master}"
# Prefer a sibling of the PR checkout so Docker/wp-env can bind-mount it reliably.
# Override with PERF_MASTER_WORKTREE_ROOT when needed (e.g. local runs).
WORKTREE_ROOT="${PERF_MASTER_WORKTREE_ROOT:-$(cd "${ROOT_DIR}/.." && pwd)/blockera-perf-baseline}"
# Final path segment must be `blockera` so wp-env registers plugin slug `blockera`.
MASTER_PLUGIN_DIR="${WORKTREE_ROOT}/blockera"

export WP_BASE_URL="${WP_BASE_URL:-http://localhost:8888}"
export WP_ARTIFACTS_PATH="${ARTIFACTS_DIR}"
export PERF_RESULTS_DIR="${OUT_DIR}"
export PERF_SCENARIO_SCOPE

mkdir -p "$OUT_DIR" "$ARTIFACTS_DIR" "$WORKTREE_ROOT"

cleanup_worktree() {
	if git -C "$ROOT_DIR" worktree list 2>/dev/null | grep -q "${MASTER_PLUGIN_DIR}"; then
		echo "Removing master worktree at ${MASTER_PLUGIN_DIR}..."
		git -C "$ROOT_DIR" worktree remove --force "${MASTER_PLUGIN_DIR}" 2>/dev/null || true
	fi
	rm -rf "${MASTER_PLUGIN_DIR}" 2>/dev/null || true
}

write_wp_env_for_master_plugin() {
	local plugin_path="$1"
	local mu_plugins_path="${ROOT_DIR}/.github/performance/mu-plugins"

	# Keep PR perf env settings; only swap the plugin mount to the master build.
	# Absolute paths are required so wp-env does not resolve relative to the wrong cwd.
	cat >"${ROOT_DIR}/.wp-env.json" <<EOF
{
	"core": "https://wordpress.org/wordpress-latest.zip",
	"plugins": ["${plugin_path}"],
	"config": {
		"BLOCKERA_TELEMETRY_OPT_IN_OFF": true,
		"BLOCKERA_PERF_BENCHMARK": true,
		"AUTOMATIC_UPDATER_DISABLED": true,
		"DISABLE_WP_CRON": true,
		"SCRIPT_DEBUG": false,
		"WP_DEBUG": false,
		"WP_DEBUG_DISPLAY": false,
		"SAVEQUERIES": false
	},
	"mappings": {
		"wp-content/mu-plugins": "${mu_plugins_path}"
	},
	"lifecycleScripts": {
		"afterStart": "wp-env run cli -- wp theme activate twentytwentyfive && wp-env run cli -- wp option update blogname 'Blockera Perf Benchmark' && wp-env run cli -- wp rewrite structure '/%postname%/' --hard && wp-env run cli -- wp rewrite flush --hard"
	}
}
EOF
	echo "Wrote .wp-env.json with plugins=[${plugin_path}]"
	cat "${ROOT_DIR}/.wp-env.json"
}

wait_for_wp() {
	echo "Waiting for WordPress at ${WP_BASE_URL}..."
	for i in $(seq 1 36); do
		if curl -sf -o /dev/null "${WP_BASE_URL}"; then
			echo "WordPress is ready"
			return 0
		fi
		echo "Attempt ${i}/36 - WordPress not ready yet, waiting 5s..."
		sleep 5
	done
	echo "WordPress failed to become ready at ${WP_BASE_URL}"
	return 1
}

echo "=== Master Blockera editor baseline (worktree) ==="
echo "ROOT_DIR=${ROOT_DIR}"
echo "MASTER_REF=${MASTER_REF}"
echo "MASTER_PLUGIN_DIR=${MASTER_PLUGIN_DIR}"
echo "PERF_SCENARIO_SCOPE=${PERF_SCENARIO_SCOPE}"

if [[ ! -f "${ROOT_DIR}/package.json" ]] || ! node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['test:performance:editor'] ? 0 : 1)"; then
	echo "Error: PR checkout is missing npm script test:performance:editor"
	exit 1
fi

echo "Stopping wp-env before remounting master plugin..."
npm run env:stop || true

echo "Fetching ${MASTER_REF}..."
# Accept either origin/master or a bare ref name.
if [[ "${MASTER_REF}" == origin/* ]]; then
	git fetch --depth=1 origin "${MASTER_REF#origin/}"
else
	git fetch --depth=1 origin "${MASTER_REF}"
	MASTER_REF="origin/${MASTER_REF}"
fi

cleanup_worktree
echo "Creating worktree for ${MASTER_REF} at ${MASTER_PLUGIN_DIR}..."
git worktree add --detach "${MASTER_PLUGIN_DIR}" "${MASTER_REF}"

echo "Installing and building master plugin in worktree..."
(
	cd "${MASTER_PLUGIN_DIR}"
	npm ci
	composer install --no-dev -o --apcu-autoloader -a
	# Minimal .env for builds that read APP_MODE (harmless if unused on master).
	touch .env
	echo APP_MODE=production >> .env
	echo DB=wp_tests >> .env
	npm run build
)

write_wp_env_for_master_plugin "${MASTER_PLUGIN_DIR}"

echo "Starting WordPress with master Blockera plugin..."
bash "${ROOT_DIR}/.github/scripts/retry-wp-env-start.sh"
wait_for_wp

echo "Running PR editor harness against master plugin..."
npx wp-env run cli -- wp plugin activate blockera
PERF_SUBJECT=blockera \
	TEST_RESULTS_PREFIX=master-editor \
	PERF_SCENARIO_SCOPE="${PERF_SCENARIO_SCOPE}" \
	npm run test:performance:editor

echo "Master baseline artifacts:"
ls -la "${ARTIFACTS_DIR}"/master-editor-performance-results.json 2>/dev/null || {
	echo "Error: master-editor-performance-results.json was not produced"
	exit 1
}

# Restore default perf mapping to the PR plugin for a predictable teardown.
cp "${ROOT_DIR}/.github/wp-env-configs/performance.json" "${ROOT_DIR}/.wp-env.json"

echo "Master Blockera editor baseline complete."

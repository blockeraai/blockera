#!/usr/bin/env bash
# Publish page-1 (complex-2 fixture) as a page and emit resolved scenario paths for Playwright.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

SCENARIOS_FILE="${SCENARIOS_FILE:-.github/performance/scenarios.json}"
OUT_DIR="${PERF_RESULTS_DIR:-.github/performance/results}"
HOST_FIXTURE="${ROOT_DIR}/tests/fixtures/complex-2/input.html"
SLUG="perf-page-1"
EVAL_FILE="wp-content/plugins/blockera/.github/performance/scripts/publish-page-1.php"

export SCENARIOS_FILE
export PERF_RESULTS_DIR="$OUT_DIR"

mkdir -p "$OUT_DIR"

if [[ ! -f "$HOST_FIXTURE" ]]; then
	echo "Error: fixture not found at ${HOST_FIXTURE}"
	exit 1
fi

BASE_URL="$(node -e "const s=require('./${SCENARIOS_FILE}'); process.stdout.write(s.defaults.baseUrl || 'http://localhost:8888')")"

echo "Publishing fixture tests/fixtures/complex-2/input.html as page /${SLUG}/ ..."

POST_ID="$(
	npx wp-env run cli -- wp eval-file "$EVAL_FILE" | tr -d '\r' | tail -n1
)"

if [[ ! "$POST_ID" =~ ^[0-9]+$ ]]; then
	echo "Error: failed to create/update page (got: ${POST_ID})"
	exit 1
fi

echo "Page ID: ${POST_ID}"

npx wp-env run cli -- wp rewrite flush --hard >/dev/null

# Ensure the default Hello World post (ID 1) is published for the front-default-post scenario.
# Prefer the canonical permalink: `/?p=1` redirects under pretty permalinks.
npx wp-env run cli -- wp post update 1 --post_status=publish >/dev/null 2>&1 || true
DEFAULT_POST_ID=1
DEFAULT_POST_URL="$(
	npx wp-env run cli -- wp post url 1 2>/dev/null | tr -d '\r' | tail -n1 || true
)"
DEFAULT_POST_PATH="/?p=1"
if [[ -n "${DEFAULT_POST_URL:-}" && "$DEFAULT_POST_URL" =~ ^https?:// ]]; then
	DEFAULT_POST_PATH="$(
		node -e "const u=new URL(process.argv[1]); process.stdout.write(u.pathname + u.search);" "$DEFAULT_POST_URL"
	)"
fi
DEFAULT_POST_CODE="$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}${DEFAULT_POST_PATH}" || true)"
if [[ "$DEFAULT_POST_CODE" != "200" ]]; then
	echo "Warning: default post ID 1 at ${DEFAULT_POST_PATH} returned HTTP ${DEFAULT_POST_CODE}; scenario may fail."
else
	echo "Default post ID 1 URL: ${DEFAULT_POST_PATH}"
fi

FRONT_PATH="/${SLUG}/"
HTTP_CODE="$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}${FRONT_PATH}" || true)"
if [[ "$HTTP_CODE" != "200" ]]; then
	FRONT_PATH="/?page_id=${POST_ID}"
	echo "Pretty permalink returned ${HTTP_CODE}; using ${FRONT_PATH}"
fi

HOME_CODE="$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}/" || true)"
if [[ "$HOME_CODE" != "200" ]]; then
	echo "Warning: home page returned HTTP ${HOME_CODE}; scenario may fail."
fi

cat > "${OUT_DIR}/content-state.json" <<EOF
{
  "postId": ${POST_ID},
  "slug": "${SLUG}",
  "frontPath": "${FRONT_PATH}",
  "defaultPostId": ${DEFAULT_POST_ID},
  "defaultPostPath": "${DEFAULT_POST_PATH}",
  "homePath": "/",
  "baseUrl": "${BASE_URL}"
}
EOF

node <<'NODE'
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const scenariosFile = process.env.SCENARIOS_FILE || '.github/performance/scenarios.json';
const outDir = process.env.PERF_RESULTS_DIR || '.github/performance/results';
const scenarios = JSON.parse(fs.readFileSync(path.join(root, scenariosFile), 'utf8'));
const state = JSON.parse(fs.readFileSync(path.join(root, outDir, 'content-state.json'), 'utf8'));
const base = (scenarios.defaults && scenarios.defaults.baseUrl) || state.baseUrl;

const resolved = [];

for (const scenario of scenarios.scenarios || []) {
	let p = scenario.path || '/';
	if (scenario.id === 'front-page-1') {
		p = state.frontPath;
	} else if (scenario.id === 'front-home') {
		p = state.homePath || '/';
	} else if (scenario.id === 'front-default-post') {
		p = state.defaultPostPath || '/?p=1';
	}
	p = p.replace('{POST_ID}', String(state.postId));
	p = p.replace('{ID}', String(state.postId));

	const url = new URL(p, base.endsWith('/') ? base : base + '/').href;
	resolved.push({ ...scenario, resolvedPath: p, url });
}

fs.writeFileSync(
	path.join(root, outDir, 'resolved-scenarios.json'),
	JSON.stringify({ defaults: scenarios.defaults, scenarios: resolved }, null, '\t') + '\n'
);

console.log('Wrote resolved scenarios:');
for (const s of resolved) {
	console.log(`  ${s.id}: ${s.resolvedPath}`);
}
NODE

echo "Content setup complete."

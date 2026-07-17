#!/usr/bin/env bash
# Publish complex-1 fixture as a page and emit resolved scenario URLs for benchmarking.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

SCENARIOS_FILE="${SCENARIOS_FILE:-.github/performance/scenarios.json}"
OUT_DIR="${PERF_RESULTS_DIR:-.github/performance/results}"
HOST_FIXTURE="${ROOT_DIR}/tests/fixtures/complex-1/input.html"
SLUG="perf-complex-1"
EVAL_FILE="wp-content/plugins/blockera/.github/performance/scripts/publish-complex-1.php"

export SCENARIOS_FILE
export PERF_RESULTS_DIR="$OUT_DIR"

mkdir -p "$OUT_DIR"

if [[ ! -f "$HOST_FIXTURE" ]]; then
	echo "Error: fixture not found at ${HOST_FIXTURE}"
	exit 1
fi

BASE_URL="$(node -e "const s=require('./${SCENARIOS_FILE}'); process.stdout.write(s.defaults.baseUrl || 'http://localhost:8888')")"

echo "Publishing fixture tests/fixtures/complex-1/input.html as page /${SLUG}/ ..."

POST_ID="$(
	npx wp-env run cli -- wp eval-file "$EVAL_FILE" | tr -d '\r' | tail -n1
)"

if [[ ! "$POST_ID" =~ ^[0-9]+$ ]]; then
	echo "Error: failed to create/update page (got: ${POST_ID})"
	exit 1
fi

echo "Page ID: ${POST_ID}"

npx wp-env run cli -- wp rewrite flush --hard >/dev/null

FRONT_PATH="/${SLUG}/"
HTTP_CODE="$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}${FRONT_PATH}" || true)"
if [[ "$HTTP_CODE" != "200" ]]; then
	FRONT_PATH="/?page_id=${POST_ID}"
	echo "Pretty permalink returned ${HTTP_CODE}; using ${FRONT_PATH}"
fi

cat > "${OUT_DIR}/content-state.json" <<EOF
{
  "postId": ${POST_ID},
  "slug": "${SLUG}",
  "frontPath": "${FRONT_PATH}",
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

const urls = [];
const resolved = [];

for (const scenario of scenarios.scenarios || []) {
	let p = scenario.path || '/';
	if (scenario.id === 'front-complex-1') {
		p = state.frontPath;
	}
	p = p.replace('{POST_ID}', String(state.postId));
	p = p.replace('{ID}', String(state.postId));

	const url = new URL(p, base.endsWith('/') ? base : base + '/').href;
	urls.push(url);
	resolved.push({ ...scenario, resolvedPath: p, url });
}

fs.writeFileSync(path.join(root, outDir, 'urls.txt'), urls.join('\n') + '\n');
fs.writeFileSync(
	path.join(root, outDir, 'resolved-scenarios.json'),
	JSON.stringify({ defaults: scenarios.defaults, scenarios: resolved }, null, '\t') + '\n'
);

console.log('Wrote URLs:');
for (const u of urls) {
	console.log('  ' + u);
}
NODE

echo "Content setup complete."

#!/usr/bin/env bash
# Verify the CI Server-Timing MU-plugin is emitting headers (no Performance Lab).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

echo "Verifying Server-Timing header from mu-plugin on home URL..."
HEADER_OUT="$(curl -sI "http://localhost:8888/?rnd=${RANDOM}" || true)"
if echo "$HEADER_OUT" | grep -qi 'server-timing'; then
	echo "Server-Timing header present."
	echo "$HEADER_OUT" | grep -i 'server-timing' || true
else
	echo "Warning: Server-Timing header not detected on HEAD (may still emit on full GET)."
	# Full GET can expose headers that HEAD omits on some stacks.
	curl -sD - -o /dev/null "http://localhost:8888/?rnd=${RANDOM}" | grep -i 'server-timing' || {
		echo "Error: Server-Timing header missing. Check .github/performance/mu-plugins/server-timing.php and BLOCKERA_PERF_BENCHMARK."
		exit 1
	}
fi

echo "Server-Timing setup complete."

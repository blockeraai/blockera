#!/usr/bin/env bash
# Disable Performance Lab feature modules so only Server-Timing infrastructure runs.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

echo "Configuring Performance Lab for Server-Timing benchmarks..."

npx wp-env run cli -- wp plugin activate performance-lab || true

# Clear / disable all Performance Lab modules (option key used by recent Perf Lab releases).
npx wp-env run cli -- wp option delete perflab_modules_settings 2>/dev/null || true
npx wp-env run cli -- wp option update perflab_modules_settings '{}' --format=json 2>/dev/null || true

# Persist output-buffering preference when the option exists (filter in mu-plugin is the primary enablement).
npx wp-env run cli -- wp option update perflab_server_timing_output_buffer_enabled 1 2>/dev/null || true

echo "Verifying Server-Timing header on home URL..."
HEADER_OUT="$(curl -sI "http://localhost:8888/?rnd=${RANDOM}" || true)"
if echo "$HEADER_OUT" | grep -qi 'server-timing'; then
	echo "Server-Timing header present."
	echo "$HEADER_OUT" | grep -i 'server-timing' || true
else
	echo "Warning: Server-Timing header not detected yet (mu-plugin filter / Perf Lab may still emit on full GET)."
	# Full GET can expose headers that HEAD omits on some stacks.
	curl -sD - -o /dev/null "http://localhost:8888/?rnd=${RANDOM}" | grep -i 'server-timing' || {
		echo "Error: Server-Timing header missing. Check Performance Lab activation and BLOCKERA_PERF_BENCHMARK."
		exit 1
	}
fi

echo "Server-Timing setup complete."

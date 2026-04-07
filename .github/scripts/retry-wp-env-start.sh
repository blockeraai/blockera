#!/usr/bin/env bash
# wp-env Docker builds pull Alpine indexes during `apk add`; dl-cdn.alpinelinux.org
# occasionally returns transient errors in CI, which surfaces as "no such package".
set -u

MAX="${WP_ENV_START_RETRIES:-4}"
DELAY="${WP_ENV_START_RETRY_DELAY_SEC:-20}"

for ((i = 1; i <= MAX; i++)); do
	echo "wp-env start: attempt ${i} of ${MAX}"
	if npm run env:start; then
		exit 0
	fi
	if ((i < MAX)); then
		echo "wp-env start failed; retrying in ${DELAY}s..."
		sleep "${DELAY}"
	fi
done

exit 1

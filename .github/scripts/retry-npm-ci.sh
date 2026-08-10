#!/usr/bin/env bash
# npm registry downloads occasionally time out in CI (ETIMEDOUT).
set -u

MAX="${NPM_CI_RETRIES:-4}"
DELAY="${NPM_CI_RETRY_DELAY_SEC:-30}"

npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000

for ((i = 1; i <= MAX; i++)); do
	echo "npm ci: attempt ${i} of ${MAX}"
	if npm ci --legacy-peer-deps --prefer-offline --no-audit; then
		exit 0
	fi
	if ((i < MAX)); then
		echo "npm ci failed; retrying in ${DELAY}s..."
		sleep "${DELAY}"
	fi
done

exit 1

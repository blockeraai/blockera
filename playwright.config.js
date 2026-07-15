/**
 * External dependencies
 */
const fs = require('fs');
const path = require('path');
const { defineConfig } = require('@playwright/test');
const baseConfig = require('@wordpress/scripts/config/playwright.config.js');

/**
 * Internal dependencies
 */
const envPath = path.resolve(__dirname, './playwright.env.json');
const prEnvPath = path.resolve(__dirname, './.pr-playwright.env.json');

// If env file exists, load it into process.env.
if (fs.existsSync(envPath)) {
	const playwrightEnv = require(envPath);
	process.env = {
		...process.env,
		...playwrightEnv,
	};
}

// Optional PR-scoped filter (committed on feature branches only; see check-pr-config-files.yml).
let prPlaywrightEnv = {};
if (fs.existsSync(prEnvPath)) {
	prPlaywrightEnv = require(prEnvPath);
}

const config = defineConfig({
	...baseConfig,
	// Flaky = failed a run then passed on retry; must not fail CI unless explicitly opted in.
	failOnFlakyTests: false,
	// Snapshot update mode:
	// - `all` / UPDATE_SNAPSHOTS=1: rewrite baselines (intentional refresh only).
	// - `missing` (CI + local default): compare against committed baselines; on mismatch
	//   fail and write *-actual.png into test-results. If a baseline file is absent,
	//   take the screenshot, write *-actual.png (for artifact download), write the
	//   baseline path, and still fail — so CI does not silently invent goldens.
	// - Do NOT use `none` on CI: Playwright short-circuits missing baselines without
	//   capturing/writing the actual image, so artifacts have nothing to commit.
	updateSnapshots: (() => {
		if (
			process.env.UPDATE_SNAPSHOTS === '1' ||
			process.env.UPDATE_SNAPSHOTS === 'all'
		) {
			return 'all';
		}

		if (process.env.UPDATE_SNAPSHOTS === 'none') {
			return 'none';
		}

		return 'missing';
	})(),
	testDir: './',
	testMatch: prPlaywrightEnv.testMatch ?? '**/*.ply.js',
	...(Array.isArray(prPlaywrightEnv.testIgnore) &&
	prPlaywrightEnv.testIgnore.length
		? { testIgnore: prPlaywrightEnv.testIgnore }
		: {}),
	reporter: process.env.CI
		? [
				['list'], // Shows test names and progress in real-time
				['github'], // GitHub Actions integration
				['html', { outputFolder: 'playwright-report', open: 'never' }], // HTML report
				['./packages/dev-playwright/js/config/flaky-tests-report.ts'],
				[
					'json',
					{ outputFile: 'artifacts/playwright-e2e-summary.json' },
				],
			]
		: 'list',
	webServer: {
		...baseConfig.webServer,
		command: 'npm run env:start',
	},
});

export default config;

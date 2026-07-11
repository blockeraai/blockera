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
	// Always write/regenerate Playwright screenshot baselines (toHaveScreenshot).
	// CLI can still override (e.g. --update-snapshots=none).
	updateSnapshots: 'all',
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

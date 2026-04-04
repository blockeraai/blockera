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

// If env file exists, load it into process.env.
if (fs.existsSync(envPath)) {
	const playwrightEnv = require(envPath);
	process.env = {
		...process.env,
		...playwrightEnv,
	};
}

const config = defineConfig({
	...baseConfig,
	// Always write/regenerate Playwright screenshot baselines (toHaveScreenshot).
	// CLI can still override (e.g. --update-snapshots=none).
	updateSnapshots: 'all',
	testDir: './',
	testMatch: '**/*.ply.js',
	reporter: process.env.CI
		? [
				['list'], // Shows test names and progress in real-time
				['github'], // GitHub Actions integration
				['html', { outputFolder: 'playwright-report', open: 'never' }], // HTML report
				['./packages/dev-playwright/js/config/flaky-tests-report.ts'],
			]
		: 'list',
	webServer: {
		...baseConfig.webServer,
		command: 'npm run env:start',
	},
});

export default config;

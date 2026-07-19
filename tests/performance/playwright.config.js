/**
 * Playwright config for Blockera vs Core Server-Timing benchmarks.
 *
 * Adapted from WordPress core tests/performance/playwright.config.js
 * Uses existing wp-env on :8888 (started by CI / `npm run env:start`).
 */

const path = require('node:path');
const { defineConfig } = require('@playwright/test');
const baseConfig = require('@wordpress/scripts/config/playwright.config.js');

process.env.WP_BASE_URL ??= 'http://localhost:8888';
process.env.WP_ARTIFACTS_PATH ??= path.join(process.cwd(), 'artifacts');
process.env.STORAGE_STATE_PATH ??= path.join(
	process.env.WP_ARTIFACTS_PATH,
	'storage-states/admin.json'
);
process.env.TEST_RUNS ??= '20';

const baseUrl = new URL(process.env.WP_BASE_URL);

const config = defineConfig({
	...baseConfig,
	testDir: path.join(__dirname, 'specs'),
	globalSetup: require.resolve('./config/global-setup.js'),
	reporter: [['list'], [require.resolve('./config/performance-reporter.js')]],
	forbidOnly: !!process.env.CI,
	workers: 1,
	retries: 0,
	repeatEach: 2,
	timeout: parseInt(process.env.TIMEOUT || '', 10) || 600_000,
	reportSlowTests: null,
	preserveOutput: 'never',
	webServer: {
		...baseConfig.webServer,
		command: 'npm run env:start',
		port: Number(baseUrl.port) || 8888,
		reuseExistingServer: true,
	},
	use: {
		...baseConfig.use,
		baseURL: baseUrl.href,
		video: 'off',
		trace: 'off',
		screenshot: 'off',
	},
});

module.exports = config;

/**
 * Playwright config for Blockera vs Core block-editor (client) benchmarks.
 *
 * Same env as Server-Timing suite; Chromium tracing metrics via Metrics fixture.
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

const baseUrl = new URL(process.env.WP_BASE_URL);

const config = defineConfig({
	...baseConfig,
	testDir: path.join(__dirname, 'specs'),
	testMatch: '**/editor-scenarios.test.js',
	globalSetup: require.resolve('./config/global-setup.js'),
	reporter: [['list'], [require.resolve('./config/performance-reporter.js')]],
	forbidOnly: !!process.env.CI,
	workers: 1,
	retries: 0,
	// Editor suites use fixed 10+1 samples inside the spec (Gutenberg style).
	repeatEach: 1,
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
		// Editor load + 1000-block fixtures need more than the default 10s.
		actionTimeout: 120_000,
		video: 'off',
		// Playwright's own tracing injects DOM snapshot work that pollutes
		// Chromium Metrics traces (same rationale as Gutenberg perf config).
		trace: 'off',
		screenshot: 'off',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...require('@playwright/test').devices['Desktop Chrome'] },
		},
	],
});

module.exports = config;

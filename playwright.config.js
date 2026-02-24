/**
 * External dependencies
 */
const { defineConfig } = require('@playwright/test');

/**
 * WordPress dependencies
 */
const baseConfig = require('@wordpress/scripts/config/playwright.config.js');

// wp-env uses port 8888 by default; ensure baseURL is set for CI and when WP_BASE_URL is provided
const baseURL =
	process.env.WP_BASE_URL ||
	(process.env.CI ? 'http://localhost:8888' : undefined);

const config = defineConfig({
	...baseConfig,
	testDir: './',
	testMatch: '**/*.ply.js',
	use: {
		...(baseConfig.use || {}),
		...(baseURL && { baseURL }),
	},
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

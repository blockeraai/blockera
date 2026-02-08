/**
 * External dependencies
 */
const { defineConfig } = require('@playwright/test');

/**
 * WordPress dependencies
 */
const baseConfig = require('@wordpress/scripts/config/playwright.config.js');

const config = defineConfig({
	...baseConfig,
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

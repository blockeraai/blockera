/**
 * External dependencies
 */
const { fileURLToPath } = require('url');
const { defineConfig } = require('@playwright/test');

/**
 * WordPress dependencies
 */
const baseConfig = require('@wordpress/scripts/config/playwright.config.js');

const config = defineConfig({
	...baseConfig,
	testDir: '.',
	testMatch: '**/*.ply.js',
	reporter: process.env.CI
		? [
				['list'],
				['github'],
				['./packages/dev-playwright/js/config/flaky-tests-report.ts'],
		  ]
		: 'list',
	workers: 1,
	globalSetup: fileURLToPath(
		new URL(
			'./packages/dev-playwright/js/config/global-setup.ts',
			'file:' + __filename
		).href
	),
	webServer: {
		...baseConfig.webServer,
		command: 'npm run env:start',
	},
});

export default config;

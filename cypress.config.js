const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let env = {
	wpUsername: 'admin',
	wpPassword: 'password',
	testURL: 'http://localhost:8888',
	e2e: {
		specPattern: [
			'packages/**/*.e2e.cy.js',
			'tests/**/*.e2e.cy.js',
			'packages/**/*.visual.cy.js',
			'tests/**/*.visual.cy.js',
		],
		excludeSpecPattern: ['packages/**/*.build.e2e.js'],
	},
};

// This is a workaround for localization of the cypress env file.
env = {
	...env,
	...(fs.existsSync(path.resolve(__dirname, 'cypress.env.json'))
		? require('./cypress.env.json')
		: {}),
	...(fs.existsSync(path.resolve(__dirname, '.pr-cypress.env.json'))
		? require('./.pr-cypress.env.json')
		: {}),
	...process.env,
};

const setupNodeEvents = (on, config) => {
	require('./packages/dev-cypress/js/plugins/index.js')(on, config);
	//Requires and imports the main plugin function from the cypress-image-diff-js NPM package
	const getCompareSnapshotsPlugin = require('cypress-image-diff-js/plugin');
	//Calls the plugin's getCompareSnapshotsPlugin function, passing Cypress' on and config objects, to intialize and register the plugin with Cypress
	getCompareSnapshotsPlugin(on, config);

	return config;
};

module.exports = defineConfig({
	chromeWebSecurity: false,
	defaultCommandTimeout: 15000,
	e2e: {
		setupNodeEvents,
		specPattern: env.e2e.specPattern,
		excludeSpecPattern: env.e2e.excludeSpecPattern,
		supportFile: 'packages/dev-cypress/js/support/e2e.js',
	},
	env,
	fixturesFolder: 'packages/dev-cypress/js/fixtures',
	pageLoadTimeout: 120000,
	projectId: 'blockera',
	// runMode: 2 => up to 3 attempts per test (1 run + 2 retries on failure).
	retries: {
		openMode: 0,
		runMode: 2,
	},
	coverage: true,
	screenshotOnRunFailure: false,
	screenshotsFolder: 'packages/dev-cypress/js/screenshots',
	videosFolder: 'packages/dev-cypress/js/videos',
	viewportHeight: 1440,
	viewportWidth: 2560,
	component: {
		setupNodeEvents,
		devServer: {
			framework: 'react',
			bundler: 'webpack',
		},
		specPattern: 'packages/**/*.cy.js',
		supportFile: 'packages/dev-cypress/js/support/component.js',
	},
	numTestsKeptInMemory: 25,
	experimentalMemoryManagement: true,
});

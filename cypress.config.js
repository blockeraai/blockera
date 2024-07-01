const { defineConfig } = require('cypress');

const setupNodeEvents = (on, config) => {
	require('./packages/dev-cypress/js/plugins/index.js')(on, config);
	require('@cypress/code-coverage/task')(on, config);

	return config;
};

module.exports = defineConfig({
	chromeWebSecurity: false,
	defaultCommandTimeout: 15000,
	e2e: {
		setupNodeEvents,
		specPattern: [
			'packages/**/*.cypress.js',
			'packages/**/*.cy.compatibility.js',
		],
		supportFile: 'packages/dev-cypress/js/support/e2e.js',
	},
	env: {
		wpUsername: 'admin',
		wpPassword: 'password',
		testURL: 'http://localhost:8888',
	},
	fixturesFolder: 'packages/dev-cypress/js/fixtures',
	pageLoadTimeout: 120000,
	projectId: 'blockera',
	retries: {
		openMode: 0,
		runMode: 0,
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
});

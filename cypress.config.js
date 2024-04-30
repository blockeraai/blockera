const { defineConfig } = require('cypress');

module.exports = defineConfig({
	chromeWebSecurity: false,
	defaultCommandTimeout: 20000,
	e2e: {
		setupNodeEvents(on, config) {
			require('./cypress/plugins/index.js')(on, config);
			require('@cypress/code-coverage/task')(on, config);

			return config;
		},
		specPattern: [
			'packages/**/*.cypress.js',
			'packages/**/*.cy.compatibility.js',
		],
		supportFile: 'cypress/support/e2e.js',
	},
	env: {
		wpUsername: 'admin',
		wpPassword: 'password',
		testURL: 'http://localhost:8888',
	},
	fixturesFolder: 'cypress/fixtures',
	pageLoadTimeout: 120000,
	projectId: 'blockera',
	retries: {
		openMode: 0,
		runMode: 0,
	},
	coverage: true,
	screenshotsFolder: 'cypress/screenshots',
	videosFolder: 'cypress/videos',
	viewportHeight: 1440,
	viewportWidth: 2560,
	component: {
		setupNodeEvents(on, config) {
			require('./cypress/plugins/index.js')(on, config);
			require('@cypress/code-coverage/task')(on, config);

			return config;
		},
		devServer: {
			framework: 'react',
			bundler: 'webpack',
		},
		specPattern: 'packages/**/*.cy.js',
		supportFile: 'cypress/support/component.js',
	},
});

const { defineConfig } = require("cypress");

module.exports = defineConfig({
	chromeWebSecurity: false,
	defaultCommandTimeout: 20000,
	e2e: {
		setupNodeEvents(on, config) {
			return require("./.dev/tests/cypress/plugins/index.js")(on, config);
		},
		specPattern: ".//**/*.cypress.js",
		supportFile: ".dev/tests/cypress/support/commands.js",
	},
	env: {
		wpUsername: "admin",
		wpPassword: "password",
		testURL: "http://localhost:8889",
	},
	fixturesFolder: "languages",
	pageLoadTimeout: 120000,
	projectId: "sovnn2",
	retries: {
		openMode: 0,
		runMode: 0,
	},
	screenshotsFolder: ".dev/tests/cypress/screenshots",
	videosFolder: ".dev/tests/cypress/videos",
	viewportHeight: 1440,
	viewportWidth: 2560,
});

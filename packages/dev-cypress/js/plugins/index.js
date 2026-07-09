const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');

module.exports = (on, config) => {
	const options = {
		webpackOptions: require(path.resolve(
			__dirname,
			'../webpack.config.js'
		)),
		watchOptions: {},
	};

	on('file:preprocessor', webpack(options));

	require('cypress-log-to-output').install(
		on,
		(type, event) => event.level === 'error' || event.type === 'error'
	);

	on('before:browser:launch', (browser = {}, launchOptions) => {
		if (browser.family === 'chromium' && browser.name !== 'electron') {
			// Disable GPU acceleration which can help in some CI environments
			launchOptions.args.push('--disable-gpu');
			// Increase shared memory usage in Docker or constrained environments
			launchOptions.args.push('--disable-dev-shm-usage');
		}
		return launchOptions;
	});
};

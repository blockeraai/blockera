const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');

module.exports = (on, config) => {
	if (!config.env?.isE2E) {
		const options = {
			webpackOptions: require(path.resolve(
				__dirname,
				'../webpack.config.js'
			)),
			watchOptions: {},
		};

		on('file:preprocessor', webpack(options));
	}

	require('cypress-log-to-output').install(
		on,
		(type, event) => event.level === 'error' || event.type === 'error'
	);
};

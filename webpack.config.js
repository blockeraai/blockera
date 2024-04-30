/**
 * External dependencies
 */
const path = require('path');

/**
 * Internal dependencies
 */
const packagesConfig = require('./tools/webpack/packages');

module.exports = (on, config) => {
	if (!config) {
		return require(path.resolve(
			process.cwd(),
			'tools/cypress/webpack.config.js'
		));
	}

	return packagesConfig({}, { mode: config?.mode || 'production' });
};

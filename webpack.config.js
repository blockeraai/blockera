/**
 * External dependencies
 */
const path = require('path');

/**
 * Internal dependencies
 */
const packagesConfig = require('./packages/dev-tools/js/webpack/packages');

module.exports = (env, argv) => {
	if (!argv) {
		return require(path.resolve(
			process.cwd(),
			'packages/dev-tools/js/cypress/webpack.config.js'
		));
	}

	return packagesConfig(env, { ...argv, mode: argv?.mode || 'production' });
};

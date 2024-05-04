const packagesWebpackConfig = require('./webpack/packages');
const cypressWebpackConfig = require('./cypress/webpack.config');
const eslintImportResolver = require('./eslint/import-resolver');
const packagesStylesWebpackConfig = require('./webpack/packages-styles');

module.exports = () => ({
	cypressWebpackConfig,
	eslintImportResolver,
	packagesWebpackConfig,
	packagesStylesWebpackConfig,
});

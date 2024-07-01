const packagesWebpackConfig = require('./webpack/packages');
const eslintImportResolver = require('./eslint/import-resolver');
const packagesStylesWebpackConfig = require('./webpack/packages-styles');

module.exports = () => ({
	eslintImportResolver,
	packagesWebpackConfig,
	packagesStylesWebpackConfig,
});

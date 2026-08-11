/**
 * Internal dependencies
 */
const { dependencies } = require('./package');
const packagesConfig = require('./packages/global-packages/packages/dev-tools/js/webpack/packages');
const createRootWebpackConfig = require('./packages/global-packages/packages/dev-tools/js/webpack/create-root-config');

/**
 * Resolve a Blockera package dir for the plugin (Composer vendor path repos).
 *
 * @param {string} packageName Canonical package slug.
 * @return {string} Relative package directory from the plugin root.
 */
function resolvePackageDir(packageName) {
	let parentDirectory = '';
	let name = packageName;

	if (-1 !== packageName.indexOf('block-')) {
		name = name.split('block-')[1];
		parentDirectory = 'blocks-library/';
	} else if (-1 !== packageName.indexOf('feature-')) {
		name = name.split('feature-')[1];
		parentDirectory = 'features-library/';
	}

	if (parentDirectory.endsWith('s-library/')) {
		parentDirectory = parentDirectory.replace('s-library/', '-');
	}

	return `./vendor/blockera/${parentDirectory}${name}`;
}

module.exports = createRootWebpackConfig({
	dependencies,
	packagesConfig,
	resolvePackageDir,
	getExternals: (blockeraPackagesVersion) => ({
		'@blockera/icons': 'blockeraIcons',
		'@blockera/env': 'blockeraEnv_' + blockeraPackagesVersion.env,
		'@blockera/telemetry':
			'blockeraTelemetry_' + blockeraPackagesVersion.telemetry,
		'@blockera/storage':
			'blockeraStorage_' + blockeraPackagesVersion.storage,
		'@blockera/data': 'blockeraData_' + blockeraPackagesVersion.data,
		'@blockera/utils': 'blockeraUtils_' + blockeraPackagesVersion.utils,
		'@blockera/editor': 'blockeraEditor_' + blockeraPackagesVersion.editor,
		'@blockera/global-styles-ui':
			'blockeraGlobalStylesUi_' +
			blockeraPackagesVersion['global-styles-ui'],
		'@blockera/blocks-core':
			'blockeraBlocksCore_' + blockeraPackagesVersion['blocks-core'],
		'@blockera/feature-icon':
			'blockeraFeatureIcon_' + blockeraPackagesVersion['feature-icon'],
		'@blockera/features-core':
			'blockeraFeaturesCore_' + blockeraPackagesVersion['features-core'],
		'@blockera/controls':
			'blockeraControls_' + blockeraPackagesVersion.controls,
		'@blockera/bootstrap':
			'blockeraBootstrap_' + blockeraPackagesVersion.bootstrap,
		'@blockera/wordpress':
			'blockeraWordpress_' + blockeraPackagesVersion.wordpress,
		'@blockera/classnames':
			'blockeraClassnames_' + blockeraPackagesVersion.classnames,
		'@blockera/data-editor':
			'blockeraDataEditor_' + blockeraPackagesVersion['data-editor'],
	}),
});

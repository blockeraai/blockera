/**
 * External dependencies
 */
const path = require('path');
const {
	camelCaseDash,
} = require('@wordpress/dependency-extraction-webpack-plugin/lib/util');

/**
 * Internal dependencies
 */
const { dependencies } = require('./package');
const packagesConfig = require('./vendor/blockera/dev-tools/js/webpack/packages');

const exportDefaultPackages = [];

module.exports = (env = {}, argv) => {
	if (!argv || env?.cypress) {
		return require(
			path.resolve(
				process.cwd(),
				'vendor/blockera/dev-cypress/js/webpack.config.js'
			)
		);
	}

	const BLOCKERA_NAMESPACE = '@blockera/';
	const blockeraPackages = Object.keys(dependencies)
		.filter((packageName) => packageName.startsWith(BLOCKERA_NAMESPACE))
		.map((packageName) => packageName.replace(BLOCKERA_NAMESPACE, ''));
	const blockeraPackagesVersion = Object.fromEntries(
		blockeraPackages.map((packageName) => {
			let parentDirectory = '';
			let name = packageName;

			if (-1 !== packageName.indexOf('block-')) {
				name = name.split('block-')[1];
				parentDirectory = 'blocks-library/';
			} else if (-1 !== packageName.indexOf('feature-')) {
				name = name.split('feature-')[1];
				parentDirectory = 'features-library/';
			}

			// Remove the trailing slash from the parent directory. because it is a library and includes multiple packages inside it.
			if (parentDirectory.endsWith('s-library/')) {
				parentDirectory = parentDirectory.replace('s-library/', '-');
			}

			const { version } = require(
				`./vendor/blockera/${parentDirectory}${name}/package.json`
			);

			return [packageName, version.replace(/\./g, '_')];
		})
	);
	const blockeraEntries = blockeraPackages.reduce((memo, packageName) => {
		// Exclude dev packages.
		if (-1 !== packageName.indexOf('dev-')) {
			return memo;
		}

		if (!blockeraPackagesVersion[packageName]) {
			return memo;
		}

		const version = blockeraPackagesVersion[packageName];

		let name = packageName.startsWith('blockera')
			? camelCaseDash(packageName + '_' + version)
			: camelCaseDash('blockera-' + packageName + '_' + version);

		if ('icons' === packageName) {
			name = packageName.startsWith('blockera')
				? camelCaseDash(packageName)
				: camelCaseDash('blockera-' + packageName);
		}

		return {
			...memo,
			[packageName]: {
				import: `./vendor/blockera/${packageName}`,
				library: {
					name,
					type: 'var',
					export: exportDefaultPackages.includes(packageName)
						? 'default'
						: undefined,
				},
			},
		};
	}, {});

	return packagesConfig(env, {
		...argv,
		projectRoot: process.cwd(),
		entry: blockeraEntries,
		devtoolNamespace: 'blockera',
		mode: argv?.mode || 'production',
		externals: {
			// Externalize the local packages.
			'@blockera/icons': 'blockeraIcons',
			'@blockera/env': 'blockeraEnv_' + blockeraPackagesVersion.env,
			'@blockera/telemetry':
				'blockeraTelemetry_' + blockeraPackagesVersion.telemetry,
			'@blockera/storage':
				'blockeraStorage_' + blockeraPackagesVersion.storage,
			'@blockera/data': 'blockeraData_' + blockeraPackagesVersion.data,
			'@blockera/utils': 'blockeraUtils_' + blockeraPackagesVersion.utils,
			'@blockera/editor':
				'blockeraEditor_' + blockeraPackagesVersion.editor,
			'@blockera/global-styles-ui':
				'blockeraGlobalStylesUi_' +
				blockeraPackagesVersion['global-styles-ui'],
			'@blockera/blocks-core':
				'blockeraBlocksCore_' + blockeraPackagesVersion['blocks-core'],
			'@blockera/feature-icon':
				'blockeraFeatureIcon_' +
				blockeraPackagesVersion['feature-icon'],
			'@blockera/features-core':
				'blockeraFeaturesCore_' +
				blockeraPackagesVersion['features-core'],
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
		},
	});
};

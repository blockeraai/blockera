/**
 * External dependencies
 */
const { join, resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * WordPress dependencies
 */
const postcssPlugins = require('@wordpress/postcss-plugins-preset');
const {
	camelCaseDash,
} = require('@wordpress/dependency-extraction-webpack-plugin/lib/util');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

/**
 * Internal dependencies
 */
const { dependencies } = require('../../../../package');
const styleDependencies = require('./packages-styles');

/**
 * Removes all svg rules from WordPress webpack config because it brakes the SVGR and SVGO plugins
 * Related to: https://github.com/gregberge/svgr/issues/361
 */
defaultConfig.module.rules
	.filter((rule) => rule.test)
	.forEach((rule) => {
		// Convert the test to a string, remove 'svg', and then create a new RegExp
		const source = rule.test.source;
		const modifiedSource = source
			.replace(/\|?svg\|?/g, (match) => {
				if (match.startsWith('|') && match.endsWith('|')) {
					return '|';
				}
				return '';
			})
			.replace(/^\|/, '')
			.replace(/\|$/, '');

		// If the modified source is empty or invalid, remove the rule
		if (modifiedSource) {
			rule.test = new RegExp(modifiedSource);
		} else {
			// Handle the case where the pattern is completely removed and leaves an empty string
			rule.test = null;
		}
	});

const exportDefaultPackages = [];
const BLOCKERA_NAMESPACE = '@blockera/';
const blockeraPackages = Object.keys(dependencies)
	.filter((packageName) => packageName.startsWith(BLOCKERA_NAMESPACE))
	.map((packageName) => packageName.replace(BLOCKERA_NAMESPACE, ''));
const blockeraEntries = blockeraPackages.reduce((memo, packageName) => {
	// Exclude dev packages.
	if (-1 !== packageName.indexOf('dev-')) {
		return memo;
	}

	return {
		...memo,
		[packageName]: {
			import: `./packages/${packageName}`,
			library: {
				name: packageName.startsWith('blockera')
					? camelCaseDash(packageName)
					: camelCaseDash('blockera-' + packageName), //['blockera', camelCaseDash(packageName)],
				type: 'var',
				export: exportDefaultPackages.includes(packageName)
					? 'default'
					: undefined,
			},
		},
	};
}, {});
const scssLoaders = ({ isLazy }) => [
	{
		loader: 'style-loader',
		options: { injectType: isLazy ? 'lazyStyleTag' : 'styleTag' },
	},
	'css-loader',
	{
		loader: 'postcss-loader',
		options: {
			postcssOptions: {
				ident: 'postcss',
				plugins: postcssPlugins,
			},
		},
	},
	'sass-loader',
];

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';

	return {
		mode: argv.mode,
		name: 'packages',
		entry: {
			...blockeraEntries,
			...styleDependencies.entry,
		},
		output: {
			devtoolNamespace: 'blockera',
			filename: isProduction
				? './dist/[name]/index.min.js'
				: './dist/[name]/index.js',
			path: join(__dirname, '..', '..', '..', '..'),
		},
		module: {
			rules: [
				...defaultConfig.module.rules,
				{
					test: /\.lazy\.scss$/,
					use: scssLoaders({ isLazy: true }),
					include: resolve(__dirname),
				},
				{
					test: /\.svg$/i,
					issuer: /\.[jt]sx?$/,
					use: ['@svgr/webpack'],
				},
			],
		},
		plugins: [
			new DependencyExtractionWebpackPlugin({ injectPolyfill: true }),
			new MiniCssExtractPlugin({
				filename: isProduction
					? './dist/[name]/style.min.css'
					: './dist/[name]/style.css',
				ignoreOrder: true,
			}),
		].filter(Boolean),
		optimization: {
			minimize: isProduction,
			minimizer: [
				new TerserPlugin(),
				...styleDependencies.optimization.minimizer,
			],
		},
		...(isProduction
			? {}
			: {
					devtool: 'source-map',
			  }),
		externals: {
			// Externalize the local packages.
			'@blockera/data': 'blockeraData',
			'@blockera/icons': 'blockeraIcons',
			'@blockera/utils': 'blockeraUtils',
			'@blockera/editor': 'blockeraEditor',
			'@blockera/blocks': 'blockeraBlocks',
			'@blockera/controls': 'blockeraControls',
			'@blockera/bootstrap': 'blockeraBootstrap',
			'@blockera/wordpress': 'blockeraWordpress',
			'@blockera/classnames': 'blockeraClassnames',
			'@blockera/data-editor': 'blockeraDataEditor',
		},
	};
};

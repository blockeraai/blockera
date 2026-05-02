/**
 * External dependencies
 */
const webpack = require('webpack');
const dotenv = require('dotenv');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const { join, resolve } = require('path');

/**
 * WordPress dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const postcssPlugins = require('@wordpress/postcss-plugins-preset');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

/**
 * Internal dependencies
 */
const styleDependencies = require('./packages-styles');

dotenv.config();

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
	const pluginRoot = resolve(__dirname, '..', '..', '..', '..');

	const experimentalConfigDefaultPath = resolve(
		pluginRoot,
		'experimental.config.json'
	);
	const experimentalConfigLocalPath = resolve(
		pluginRoot,
		'local.experimental.config.json'
	);
	const experimentalConfigResolvedPath =
		!isProduction && fs.existsSync(experimentalConfigLocalPath)
			? experimentalConfigLocalPath
			: experimentalConfigDefaultPath;

	return {
		mode: argv.mode,
		name: 'packages',
		entry: {
			...argv.entry,
			...styleDependencies.entry,
		},
		output: {
			devtoolNamespace: argv.devtoolNamespace,
			filename: isProduction
				? './dist/[name]/[name].min.js'
				: './dist/[name]/[name].js',
			path: join(__dirname, '..', '..', '..', '..'),
		},
		module: {
			rules: [
				// Handle CSS files with ?raw query parameter (import as raw string)
				// This must come BEFORE the default CSS rules
				{
					test: /\.css$/i,
					resourceQuery: /raw/,
					type: 'asset/source',
				},
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
				{
					test: /\.(txt|html)$/,
					type: 'asset/source',
				},
			],
		},
		plugins: [
			new DependencyExtractionWebpackPlugin({ injectPolyfill: true }),
			new CopyPlugin({
				patterns: [
					{
						// __dirname is packages/dev-tools/js/webpack; go up 3 levels to packages, then into editor
						from: resolve(
							__dirname,
							'..',
							'..',
							'..',
							'editor',
							'js',
							'preview-mode',
							'header',
							'style.css'
						),
						to: 'dist/editor/preview-header.css',
					},
				],
			}),
			new MiniCssExtractPlugin({
				filename: isProduction
					? './dist/[name]/style.min.css'
					: './dist/[name]/style.css',
				ignoreOrder: true,
			}),
			new webpack.DefinePlugin({
				'process.env': JSON.stringify(process.env),
			}),
		].filter(Boolean),
		resolve: {
			...defaultConfig.resolve,
			alias: {
				...(defaultConfig.resolve?.alias || {}),
				'@blockera/experimental-config': experimentalConfigResolvedPath,
			},
			extensions: [
				'.tsx',
				'.ts',
				...(defaultConfig.resolve?.extensions || [
					'.jsx',
					'.js',
					'.json',
				]),
			],
		},
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
		externals: argv.externals,
	};
};

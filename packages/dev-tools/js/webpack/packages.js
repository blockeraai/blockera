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
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

/**
 * Internal dependencies
 */
const styleDependencies = require('./packages-styles');
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
			blockera: {
				import: './packages/blockera',
				library: {
					name: 'blockera',
					type: 'var',
					export: undefined,
				},
			},
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
	};
};

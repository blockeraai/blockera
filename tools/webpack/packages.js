/**
 * External dependencies
 */
const { join } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { isArray, mergeWith } = require('lodash');

/**
 * WordPress dependencies
 */
const {
	camelCaseDash,
} = require('@wordpress/dependency-extraction-webpack-plugin/lib/util');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

/**
 * Internal dependencies
 */
const { dependencies } = require('../../package');
const styleDependencies = require('./packages-styles');

const PUBLISHER_NAMESPACE = '@publisher/';

const publisherPackages = Object.keys(dependencies)
	.filter((packageName) => packageName.startsWith(PUBLISHER_NAMESPACE))
	.map((packageName) => packageName.replace(PUBLISHER_NAMESPACE, ''));

const exportDefaultPackages = [];

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';

	return {
		mode: argv.mode,
		name: 'packages',
		entry: {
			...mergeWith(
				publisherPackages.reduce((memo, packageName) => {
					return {
						...memo,
						[packageName]: {
							import: `./packages/${packageName}`,
							library: {
								name: ['publisher', camelCaseDash(packageName)],
								type: 'var',
								export: exportDefaultPackages.includes(
									packageName
								)
									? 'default'
									: undefined,
							},
						},
					};
				}, {}),
				styleDependencies.entry,
				(objValue, srcValue) => {
					if (isArray(objValue)) {
						return objValue.concat(srcValue);
					}
				}
			),
		},
		output: {
			devtoolNamespace: 'publisher',
			filename: isProduction
				? './dist/[name]/index.min.js'
				: './dist/[name]/index.js',
			path: join(__dirname, '..', '..'),
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					resolve: {
						extensions: ['.js', '.jsx'],
					},
					use: {
						loader: 'babel-loader',
					},
				},
				{
					test: /\.s[ac]ss$/i,
					exclude: /node_modules/,
					use: [
						// Creates `style` nodes from JS strings
						'style-loader',
						// Translates CSS into CommonJS
						'css-loader',
						// Compiles Sass to CSS
						'sass-loader',
					],
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'sass-loader',
					],
				},
			],
		},
		plugins: [
			new DependencyExtractionWebpackPlugin({ injectPolyfill: true }),
			new MiniCssExtractPlugin({
				filename: isProduction
					? './dist/[name]/style.min.css'
					: './dist/[name]/style.css',
			}),
		].filter(Boolean),
		optimization: {
			minimize: isProduction,
			minimizer: [
				new TerserPlugin(),
				...styleDependencies.optimization.minimizer,
			],
		},
	};
};

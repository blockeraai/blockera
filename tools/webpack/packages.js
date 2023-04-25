/**
 * External dependencies
 */
const { join } = require('path');

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

const PUBLISHER_NAMESPACE = '@publisher/';

const publisherPackages = Object.keys(dependencies)
	.filter((packageName) => packageName.startsWith(PUBLISHER_NAMESPACE))
	.map((packageName) => packageName.replace(PUBLISHER_NAMESPACE, ''));

const exportDefaultPackages = [];

module.exports = {
	mode: 'development',
	name: 'packages',
	entry: publisherPackages.reduce((memo, packageName) => {
		return {
			...memo,
			[packageName]: {
				import: `./packages/${packageName}`,
				library: {
					name: ['publisher', camelCaseDash(packageName)],
					type: 'var',
					export: exportDefaultPackages.includes(packageName)
						? 'default'
						: undefined,
				},
			},
		};
	}, {}),
	output: {
		devtoolNamespace: 'publisher',
		filename: './dist/[name]/index.min.js',
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
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new DependencyExtractionWebpackPlugin({ injectPolyfill: true }),
	].filter(Boolean),
};

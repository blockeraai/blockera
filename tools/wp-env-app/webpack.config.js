/**
 * WordPress dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const {
	camelCaseDash,
} = require('@wordpress/dependency-extraction-webpack-plugin/lib/util');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');
const path = require('path');

/**
 * Constants
 */
const PUBLISHER_NAMESPACE = '@publisher/';

module.exports = (env, options) => {
	const isDevMode = options?.mode === 'development';
	const config = {
		...defaultConfig,
		entry: {
			...defaultConfig.entry,
			'publisher-core-app': path.resolve(
				process.cwd(),
				'tools/wp-env-app/index.js'
			),
		},
		output: {
			...defaultConfig.output,
			path: path.resolve(process.cwd(), 'tools/wp-env-app/dist/'),
			publicPath: 'auto',
		},
		plugins: [
			...defaultConfig.plugins.filter(
				(plugin) =>
					plugin.constructor.name !==
					'DependencyExtractionWebpackPlugin'
			),
			new DependencyExtractionWebpackPlugin({
				injectPolyfill: true,
				requestToExternal(request) {
					if (request.startsWith(PUBLISHER_NAMESPACE)) {
						return [
							'publisher',
							camelCaseDash(
								request.substring(PUBLISHER_NAMESPACE.length)
							),
						];
					}
				},
			}),
			new RtlCssPlugin({
				filename: '[name]-rtl.css',
			}),
			new HtmlWebpackPlugin(),
			new webpack.ProvidePlugin({
				React: 'react',
			}),
		],
		resolve: {
			...defaultConfig.resolve,
			// alias directories to paths you can use in import() statements
			alias: {
				Root: path.resolve(__dirname, 'tools/wp-env-app/'),
			},
		},
		module: {
			rules: [
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader', 'postcss-loader'],
				},
				{
					test: /\.?js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								'@babel/preset-react',
							],
						},
					},
				},
			],
		},
	};

	if (isDevMode) {
		config.devtool = 'source-map';
	}

	return config;
};

// Set parallelism to 1 in CircleCI.
if (process.env.CI) {
	module.exports.parallelism = 1;
}

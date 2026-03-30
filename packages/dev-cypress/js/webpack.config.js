const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: ['./packages/index.js'],
	output: {
		path: './packages/dev-cypress/js/dist',
	},
	devtool: true,
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
		// Absolute path so Cypress can resolve imports from support/commands.js reliably.
		alias: {
			'blockera-editor-tabs-test-ids': path.resolve(
				__dirname,
				'../../editor/js/tabs/constants/testIds.ts'
			),
		},
	},
	module: {
		rules: [
			// Fix for webpack 5 fullySpecified: resolve issues with @wordpress/block-editor
			// (diff/lib/diff/character) and @wordpress/sync (fast-deep-equal/es6)
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
				},
			},
			{
				test: /\.(css|scss)$/i,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							// Prefer `dart-sass`
							implementation: require('sass'),
						},
					},
				],
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				resolve: {
					extensions: ['.js', '.jsx'],
				},
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-flow',
						],
					},
				},
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-typescript',
						],
					},
				},
			},
			{
				test: /packages\/.*\.svg$/,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack'],
			},
			{
				test: /\.(txt|html)$/,
				exclude:
					/(public\/index\.html|support\/component-index\.html)$/,
				type: 'asset/source',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'public', 'index.html'),
		}),
		new webpack.ProvidePlugin({
			React: 'react',
		}),
	],
};

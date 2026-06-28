const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const experimentalConfigDefaultPath = path.resolve(
	__dirname,
	'../../../experimental.config.json'
);
const experimentalConfigLocalPath = path.resolve(
	__dirname,
	'../../../local.experimental.config.json'
);
const experimentalConfigResolvedPath = fs.existsSync(
	experimentalConfigLocalPath
)
	? experimentalConfigLocalPath
	: experimentalConfigDefaultPath;

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
			'@blockera/experimental-config': experimentalConfigResolvedPath,
			'blockera-editor-tabs-test-ids': path.resolve(
				__dirname,
				'../../editor/js/tabs/constants/testIds.ts'
			),
			'blockera-editor-preview-test-ids': path.resolve(
				__dirname,
				'../../editor/js/preview-mode/constants/testIds.ts'
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
							// Prefer `dart-sass`; keep legacy API so webpack `~` imports resolve.
							implementation: require('sass'),
							sassOptions: {
								silenceDeprecations: [
									'legacy-js-api',
									'import',
								],
							},
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
				test: /\.(png|jpe?g|gif|webp|avif)$/i,
				type: 'asset/resource',
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

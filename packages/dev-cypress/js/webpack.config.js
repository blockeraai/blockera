const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const postcssPlugins = require('@wordpress/postcss-plugins-preset');

const pluginRoot = path.resolve(__dirname, '../../..');
const babelConfigPath = path.resolve(pluginRoot, 'babel.config.js');

const experimentalConfigDefaultPath = path.resolve(
	pluginRoot,
	'experimental.config.json'
);
const experimentalConfigLocalPath = path.resolve(
	pluginRoot,
	'local.experimental.config.json'
);
const experimentalConfigResolvedPath = fs.existsSync(
	experimentalConfigLocalPath
)
	? experimentalConfigLocalPath
	: experimentalConfigDefaultPath;

const isCi = Boolean(process.env.CI);
const controlsStylesCss = path.resolve(
	pluginRoot,
	isCi
		? 'dist/controls-styles/style.min.css'
		: 'dist/controls-styles/style.css'
);

module.exports = {
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
	// Avoid filesystem cache — it breaks Cypress JIT spec chunks (spec-0 load failures).
	devtool: false,
	stats: 'errors-warnings',
	optimization: {
		splitChunks: false,
		runtimeChunk: false,
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
		alias: {
			'@blockera/controls-styles-css$': controlsStylesCss,
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
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
				},
			},
			// Pre-built CSS — skip sass/postcss for faster component-test rebuilds.
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.scss$/i,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: postcssPlugins,
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
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
				use: {
					loader: 'babel-loader',
					options: {
						configFile: babelConfigPath,
						cacheDirectory: true,
						cacheCompression: false,
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
							['@babel/preset-react', { runtime: 'automatic' }],
						],
						cacheDirectory: true,
						cacheCompression: false,
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
		new webpack.ProvidePlugin({
			React: 'react',
		}),
	],
};

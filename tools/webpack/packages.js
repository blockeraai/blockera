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

/**
 * Internal dependencies
 */
const { dependencies } = require('../../package');
const styleDependencies = require('./packages-styles');

const exportDefaultPackages = [];
const PUBLISHER_NAMESPACE = '@publisher/';
const publisherPackages = Object.keys(dependencies)
	.filter((packageName) => packageName.startsWith(PUBLISHER_NAMESPACE))
	.map((packageName) => packageName.replace(PUBLISHER_NAMESPACE, ''));
const publisherEntries = publisherPackages.reduce((memo, packageName) => {
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
			...publisherEntries,
			...styleDependencies.entry,
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
						'style-loader', // Translates CSS into CommonJS
						'css-loader', //  Compiles Sass to CSS
						'sass-loader',
					],
				},
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
		devtool: 'inline-source-map',
	};
};

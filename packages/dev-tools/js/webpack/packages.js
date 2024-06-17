/**
 * External dependencies
 */
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
		externals: argv.externals,
	};
};

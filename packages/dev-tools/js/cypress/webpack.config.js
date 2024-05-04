const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: [path.join(__dirname, 'packages', 'index.js')],
	output: {
		path: path.resolve(__dirname, 'tools/cypress/dist'),
	},
	devtool: false,
	module: {
		rules: [
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
						presets: ['@babel/preset-env', '@babel/preset-react'],
					},
				},
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

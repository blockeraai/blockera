const path = require('path');

// eslint-disable-next-line jsdoc/valid-types
/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
	stories: [
		'../stories/**/*.mdx',
		'../stories/**/*.stories.@(js|jsx|ts|tsx)',
		'../packages/controls/src/**/stories/*.@(js|jsx|ts|tsx)',
		// '../packages/fields/stories/**/*.stories.@(js|jsx|ts|tsx)',
		// '../packages/extensions/stories/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	webpackFinal: async (_config) => {
		_config.module.rules.push({
			test: /\.scss$/,
			use: ['style-loader', 'css-loader', 'sass-loader'],
			include: path.resolve(__dirname, '../'),
		});
		_config.module.rules.push({
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			resolve: {
				extensions: ['.js', '.jsx'],
			},
			use: {
				loader: 'babel-loader',
			},
		});
		return _config;
	},
};
export default config;

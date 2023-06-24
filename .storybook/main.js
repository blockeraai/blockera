import path from 'path';

// eslint-disable-next-line jsdoc/valid-types
/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
	stories: [
		'../packages/controls/src/**/stories/*.@(js|jsx|ts|tsx)',
		'../packages/fields/src/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/extensions/src/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/components/src/**/stories/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		'@storybook/addon-a11y',
		'storybook-source-link',
		'@storybook/addon-jest',
		'@storybook/addon-links',
		'@storybook/addon-actions',
		'@storybook/addon-toolbars',
		'@storybook/addon-viewport',
		'@storybook/addon-controls',
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
	async webpackFinal(config, { configType }) {
		if (configType === 'DEVELOPMENT') {
			// Modify config for development
			config.module.rules.push(
				{
					test: /\.scss$/,
					exclude: /\.lazy\.scss$/,
					use: [
						{
							loader: 'style-loader',
							options: { injectType: 'styleTag' },
						},
						'css-loader',
						'sass-loader',
					],
					include: path.resolve(__dirname),
				},
				{
					test: /\.lazy\.scss$/,
					use: [
						{
							loader: 'style-loader',
							options: { injectType: 'lazyStyleTag' },
						},
						'css-loader',
						'sass-loader',
					],
					include: path.resolve(__dirname),
				}
			);
		}
		if (configType === 'PRODUCTION') {
			// Modify config for production
		}
		return config;
	},
};
export default config;

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
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
		'@storybook/addon-controls',
		'@storybook/addon-viewport',
		'@storybook/addon-a11y',
		'@storybook/addon-toolbars',
		'@storybook/addon-actions',
		'storybook-source-link',
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

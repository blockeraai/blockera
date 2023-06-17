// eslint-disable-next-line jsdoc/valid-types
/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
	stories: [
		'./stories/**/*.@(js|jsx|ts|tsx)',
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
	features: {
		babelModeV7: true,
		emotionAlias: false,
		storyStoreV7: true,
	},
};
export default config;

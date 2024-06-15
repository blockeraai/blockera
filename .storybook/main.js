import { defaultConfig } from '@blockera/dev-storybook';

process.env.NODE_ENV = 'DEVELOPMENT';

export default {
	stories: [
		'../packages/editor/js/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/controls/js/**/stories/*.stories.@(js|jsx|ts|tsx)',
	],

	...defaultConfig,

	typescript: {
		reactDocgen: 'react-docgen-typescript',
	},

	docs: {
		autodocs: true,
	},

	addons: ['@storybook/addon-webpack5-compiler-babel'],
};

import { defaultConfig } from '@publisher/storybook';

process.env.NODE_ENV = 'DEVELOPMENT';

export default {
	stories: [
		'../packages/controls/src/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/components/src/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/extensions/src/**/stories/*.stories.@(js|jsx|ts|tsx)',
	],
	...defaultConfig,
};

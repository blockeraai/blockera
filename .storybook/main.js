import { defaultConfig } from '@blockera/dev-storybook';

export default {
	stories: [
		'../packages/editor/js/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/controls/js/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/icons/js/**/stories/*.stories.@(js|jsx|ts|tsx)',
	],
	...defaultConfig,
};

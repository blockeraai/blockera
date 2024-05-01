import { defaultConfig } from '@blockera/dev-storybook';

process.env.NODE_ENV = 'DEVELOPMENT';

export default {
	stories: [
		'../packages/controls/js/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/components/js/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/editor-extensions/js/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/editor/js/**/stories/*.stories.@(js|jsx|ts|tsx)',
	],
	...defaultConfig,
};

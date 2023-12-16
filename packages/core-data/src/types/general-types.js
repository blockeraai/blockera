// @flow

export type ValueAddonReference = {
	type: 'core' | 'core-pro' | 'custom' | 'plugin' | 'theme',
	plugin?: string,
	theme?: string,
};

export type ValueAddonItemStatus = 'soon' | 'core' | 'core-pro';

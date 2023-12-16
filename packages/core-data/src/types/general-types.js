// @flow

export type ValueAddonReference = {
	/**
	 * Reference type of item
	 *
	 * core → PublisherBlocks
	 * core-pro → PublisherBlocks Pro
	 * custom → custom item added by code from our developers API
	 * plugin → PublisherBlocks items that rely on a third party plugin to work like Woo
	 * theme → variables that come from a theme
	 * preset → variables that come from editor (custom or editor variables)
	 */
	type: 'core' | 'core-pro' | 'custom' | 'plugin' | 'theme' | 'preset',
	/**
	 * plugin name
	 */
	plugin?: string,
	/**
	 * theme name
	 */
	theme?: string,
};

export type ValueAddonItemStatus = 'soon' | 'core' | 'core-pro';

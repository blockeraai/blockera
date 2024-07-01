// @flow

/**
 * Reference type of item
 *
 * core → Blocks
 * core-pro → Blocks Pro
 * custom → custom item added by code from our developers API
 * plugin → Blocks items that rely on a third party plugin to work like Woo
 * theme → variables that come from a theme
 * preset → variables that come from editor (custom or editor variables)
 */
export type ValueAddonReferenceType =
	| 'core'
	| 'core-pro'
	| 'custom'
	| 'plugin'
	| 'theme'
	| 'preset';

export type ValueAddonReference = {
	type: ValueAddonReferenceType,
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

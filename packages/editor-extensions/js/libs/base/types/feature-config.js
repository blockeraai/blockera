// @flow

/**
 * Internal dependencies
 */
import type { InnerBlockType } from '../../inner-blocks/types';

export type FeatureConfig = {
	/**
	 * if true is active, false is deactivated.
	 */
	status: boolean,
	/**
	 * The label to show on extension settings popup.
	 */
	label: string,
	/**
	 * if feature value is set ,so active and show on block extension.
	 */
	show: boolean,
	/**
	 * if value is truthy by default active and show on block extension.
	 */
	force: boolean,
	/**
	 * Configs for sub features.
	 */
	config?: Object,
	/**
	 * Show item in settings popover. Can be used to hide items from settings.
	 */
	showInSettings?: boolean,
	/**
	 * The css generator configuration for current feature.
	 */
	cssGenerators?: Object | {},
	/**
	 * Is active on free settings.
	 */
	isActiveOnFree?: boolean,
	/**
	 * Is active on block states? by default undefined.
	 */
	isActiveOnStates?: boolean,
	/**
	 * Is active on free plugin states? by default undefined.
	 */
	isActiveOnStatesOnFree?: boolean,
	/**
	 * Is active on breakpoints? by default undefined.
	 */
	isActiveOnBreakpoints?: boolean,
	/**
	 * Is active on free plugin breakpoints? by default undefined.
	 */
	isActiveOnBreakpointsOnFree?: boolean,
	/**
	 * Is active on inner blocks?
	 */
	isActiveOnInnerBlocks?: 'all' | Array<InnerBlockType>,
	/**
	 * Is active on free plugin inner blocks? by default undefined.
	 */
	isActiveOnInnerBlocksOnFree?: boolean,
};

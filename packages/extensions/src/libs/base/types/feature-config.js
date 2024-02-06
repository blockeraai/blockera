// @flow

/**
 * Internal dependencies
 */
import type { TStates, TBreakpoint } from '../../block-states/types';

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
	 * Is active on block states? by default all or array of state types.
	 */
	isActiveOnStates?: 'all' | Array<TStates>,
	/**
	 * Is active on breakpoints? by default all or array of breakpoint types.
	 */
	isActiveOnBreakpoints?: 'all' | Array<TBreakpoint>,
	/**
	 * Is active on inner blocks?
	 */
	isActiveOnInnerBlocks?: boolean,
	/**
	 * Is active on inner block in free?
	 */
	isActiveOnInnerBlockOnFree?: boolean,
};

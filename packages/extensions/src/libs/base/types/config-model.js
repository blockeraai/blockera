// @flow

/**
 * Internal dependencies
 */
import type { TStates, TBreakpoint } from '../../block-states/types';

export type ConfigModel = {
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
	 * The css generator configuration for current feature.
	 */
	cssGenerators?: Object | {},
	/**
	 * The active on states settings, by default all or array of state types.
	 */
	isActiveOnStates?: 'all' | Array<TStates>,
	/**
	 * The active on breakpoints settings, by default all or array of breakpoint types.
	 */
	isActiveOnBreakpoints?: 'all' | Array<TBreakpoint>,
};

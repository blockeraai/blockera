// @flow
import type {
	TBreakpoint,
	TStates,
} from '@publisher/extensions/src/libs/block-states/types';

export type FeatureWrapperProps = {
	/**
	 * CSS classes to apply to the tooltip.
	 */
	className?: string,
	/**
	 * Inner items to display in the tooltip.
	 */
	children: any,
	/**
	 * The feature is active.
	 */
	isActive?: boolean,
	/**
	 * The feature is active on the free version.
	 */
	isActiveOnFree?: boolean,
	/**
	 * Free version not active text
	 */
	isActiveOnFreeText?: string,
	/**
	 * The active on states settings, by default all or array of state types.
	 */
	isActiveOnStates?: 'all' | Array<TStates>,
	/**
	 * The active on states settings text
	 */
	isActiveOnStatesText?: string,
	/**
	 * The active on breakpoints settings, by default all or array of breakpoint types.
	 */
	isActiveOnBreakpoints?: 'all' | Array<TBreakpoint>,
	/**
	 * The active on breakpoints settings text
	 */
	isActiveOnBreakpointsText?: string,
};

// @flow

/**
 * External dependencies
 */
import type {
	TBreakpoint,
	BreakpointTypes,
} from '@blockera/editor/js/extensions/libs/block-states/types';

export const setBreakpoints = (breakpoints: {
	[key: number]: BreakpointTypes,
}): Object => {
	return {
		breakpoints,
		type: 'SET_BREAKPOINTS',
	};
};

export const editBreakpoint = (
	editedBreakpoint: BreakpointTypes,
	breakpointType: TBreakpoint
): Object => {
	return {
		breakpointType,
		editedBreakpoint,
		type: 'EDIT_BREAKPOINT',
	};
};

export const deleteBreakpoint = (breakpointType: TBreakpoint): Object => {
	return {
		breakpointType,
		type: 'DELETE_BREAKPOINT',
	};
};

export const updateBreakpoints = (breakpoints: TBreakpoint): Object => {
	return {
		breakpoints,
		type: 'UPDATE_BREAKPOINTS',
	};
};

export const setCanvasSettings = (settings: Object): Object => {
	return {
		settings,
		type: 'REGISTER_CANVAS_SETTINGS',
	};
};

export const setDeviceType = (device: TBreakpoint): Object => {
	return {
		device,
		type: 'SWITCH_BREAKPOINT',
	};
};

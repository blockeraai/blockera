// @flow

/**
 * External dependencies
 */
import type {
	TBreakpoint,
	BreakpointTypes,
} from '@blockera/extensions/src/libs/block-states/types';

export const addBreakpoint = (breakpoint: BreakpointTypes): Object => {
	return {
		breakpoint,
		type: 'ADD_BREAKPOINT',
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

export const updateBreakpoints = (breakpointTypes: TBreakpoint): Object => {
	return {
		breakpointTypes,
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

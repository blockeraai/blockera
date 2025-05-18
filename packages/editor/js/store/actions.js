// @flow

/**
 * External dependencies
 */
import type {
	StateTypes,
	TBreakpoint,
	BreakpointTypes,
} from '../extensions/libs/block-card/block-states/types';

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

export const setBlockStates = (states: {
	[key: StateTypes]: Object,
}): Object => {
	return {
		states,
		type: 'SET_BLOCK_STATES',
	};
};

export const editBlockState = (
	editedState: Object,
	stateName: StateTypes
): Object => {
	return {
		stateName,
		editedState,
		type: 'EDIT_BLOCK_STATE',
	};
};

export const deleteBlockState = (stateName: StateTypes): Object => {
	return {
		stateName,
		type: 'DELETE_BLOCK_STATE',
	};
};

export const updateBlockStates = (states: StateTypes): Object => {
	return {
		states,
		type: 'UPDATE_BLOCK_STATES',
	};
};

export const setInnerBlockStates = (states: {
	[key: StateTypes]: Object,
}): Object => {
	return {
		states,
		type: 'SET_INNER_BLOCK_STATES',
	};
};

export const editInnerBlockState = (
	editedState: Object,
	stateName: StateTypes
): Object => {
	return {
		stateName,
		editedState,
		type: 'EDIT_INNER_BLOCK_STATE',
	};
};

export const deleteInnerBlockState = (stateName: StateTypes): Object => {
	return {
		stateName,
		type: 'DELETE_INNER_BLOCK_STATE',
	};
};

export const updateInnerBlockStates = (states: StateTypes): Object => {
	return {
		states,
		type: 'UPDATE_INNER_BLOCK_STATES',
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

export const updaterDeviceType = (
	updater: (device: TBreakpoint) => void
): Object => {
	return {
		updater,
		type: 'UPDATER_DEVICE_TYPE',
	};
};

export const updaterDeviceIndicator = (
	updater: (device: TBreakpoint) => void
): Object => {
	return {
		updater,
		type: 'UPDATER_DEVICE_INDICATOR',
	};
};

export const setBlockAppSettings = (settings: Object): Object => {
	return {
		settings,
		type: 'SET_BLOCK_APP_SETTINGS',
	};
};

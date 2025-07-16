// @flow

import type {
	TStates,
	StateTypes,
	TBreakpoint,
	BreakpointTypes,
} from '../extensions/libs/block-card/block-states/types';
import { getBaseBreakpoint } from '../canvas-editor';

/**
 * Get breakpoints.
 *
 * @param {{breakpoints: Object}} state the breakpoints.
 * @return {BreakpointTypes} the breakpoints stored in redux.
 */
export const getBreakpoints = ({
	breakpoints,
}: {
	breakpoints: { [key: TBreakpoint]: BreakpointTypes },
}): { [key: TBreakpoint]: BreakpointTypes } => {
	return breakpoints;
};

/**
 * Get breakpoints.
 *
 * @param {{breakpoints: Object}} state the breakpoints.
 * @param {TBreakpoint} name the breakpoint name (type column).
 * @return {BreakpointTypes} the breakpoints stored in redux.
 */
export const getBreakpoint = (
	{
		breakpoints,
	}: {
		breakpoints: { [key: TBreakpoint]: BreakpointTypes },
	},
	name: TBreakpoint
): BreakpointTypes | void => {
	return breakpoints[name];
};

/**
 * Get available breakpoints.
 *
 * @param {{breakpoints: Object}} state the breakpoints.
 * @return {Array<TBreakpoint>} the available breakpoints.
 */
export const getAvailableBreakpoints = ({
	breakpoints,
}: {
	breakpoints: { [key: TBreakpoint]: BreakpointTypes },
}): Array<TBreakpoint> => {
	const availableBreakpoints = [];

	for (const key in breakpoints) {
		// $FlowFixMe
		const breakpoint = breakpoints[key];

		if (breakpoint?.native) {
			continue;
		}

		availableBreakpoints.push(breakpoint?.type);
	}

	return availableBreakpoints;
};

/**
 * Get states.
 *
 * @param {{states: Object}} state the states.
 * @return {Object} the states stored in redux.
 */
export const getStates = ({
	blockStates,
}: {
	blockStates: { [key: TStates]: StateTypes },
}): { [key: TStates]: StateTypes } => {
	return blockStates;
};

/**
 * Get blockStates.
 *
 * @param {{blockStates: Object}} state the blockStates.
 * @param {StateTypes} name the state name.
 * @return {StateTypes} the state stored in redux.
 */
export const getState = (
	{
		blockStates,
	}: {
		blockStates: { [key: TStates]: StateTypes },
	},
	name: TStates
): StateTypes => {
	return blockStates[name];
};

/**
 * Get available states.
 *
 * @param {{blockStates: Object}} state the block states.
 *
 * @return {Array<TStates>} the available states.
 */
export const getAvailableStates = (
	{
		blockStates,
	}: {
		blockStates: { [key: TStates]: StateTypes },
	},
	list: boolean = false
): Array<TStates> => {
	const availableStates = [];

	for (const key in blockStates) {
		const state = blockStates[key];

		if (state?.native && !list) {
			continue;
		}

		availableStates.push(state?.type);
	}

	return availableStates;
};

/**
 * Get states.
 *
 * @param {{states: Object}} state the states.
 * @return {Object} the states stored in redux.
 */
export const getInnerStates = ({
	innerBlockStates,
}: {
	innerBlockStates: { [key: TStates]: StateTypes },
}): { [key: TStates]: StateTypes } => {
	return innerBlockStates;
};

/**
 * Get blockStates.
 *
 * @param {{blockStates: Object}} state the blockStates.
 * @param {StateTypes} name the state name.
 * @return {StateTypes} the state stored in redux.
 */
export const getInnerState = (
	{
		innerBlockStates,
	}: {
		innerBlockStates: { [key: TStates]: StateTypes },
	},
	name: TStates
): StateTypes => {
	return innerBlockStates[name];
};

/**
 * Get available states.
 *
 * @param {{innerBlockStates: Object}} state the block states.
 *
 * @return {Array<TStates>} the available states.
 */
export const getAvailableInnerStates = (
	{
		innerBlockStates,
	}: {
		innerBlockStates: { [key: TStates]: StateTypes },
	},
	list: boolean = false
): Array<TStates> => {
	const availableStates = [];

	for (const key in innerBlockStates) {
		const state = innerBlockStates[key];

		if (state?.native && !list) {
			continue;
		}

		availableStates.push(state?.type);
	}

	return availableStates;
};

/**
 * Get canvas editor settings.
 *
 * @param {{canvasEditorSettings: Object}} state the canvas settings.
 *
 * @return {Object} the canvas settings data stored in redux.
 */
export const getCanvasSettings = ({
	canvasEditorSettings,
}: {
	canvasEditorSettings: Object,
}): Object => {
	return canvasEditorSettings;
};

/**
 * Get canvas editor settings.
 *
 * @param {{canvasEditorSettings: Object}} state the canvas settings.
 * @param {string} name the name of settings column.
 *
 * @return {Object} the canvas settings data stored in redux.
 */
export const getCanvasSetting = (
	{
		canvasEditorSettings,
	}: {
		canvasEditorSettings: Object,
	},
	name: string
): Object => {
	return canvasEditorSettings[name];
};

/**
 * Get activated device type of canvas editor settings.
 *
 * @param {{canvasEditorSettings: Object}} state the canvas settings.
 *
 * @return {TBreakpoint} Default is laptop. if found registered activated device type retrieve any other breakpoint types.
 */
export const getDeviceType = ({
	canvasEditorSettings,
}: {
	canvasEditorSettings: Object,
}): TBreakpoint => {
	return canvasEditorSettings.deviceType || getBaseBreakpoint();
};

export const updatePickedDeviceType = (
	{
		canvasEditorSettings,
	}: {
		canvasEditorSettings: Object,
	},
	device: TBreakpoint
): TBreakpoint => {
	return canvasEditorSettings.updatePickedDeviceType(device);
};

export const updateDeviceIndicator = (
	{
		canvasEditorSettings,
	}: {
		canvasEditorSettings: Object,
	},
	device: TBreakpoint
): TBreakpoint => {
	return canvasEditorSettings.updateDeviceIndicator(device);
};

/**
 * Get block app settings.
 *
 * @param {{blockAppSettings: Object}} state the block app settings.
 *
 * @return {Object} the block app settings data stored in redux.
 */
export const getBlockAppSettings = ({
	blockAppSettings,
}: {
	blockAppSettings: Object,
}): Object => {
	return blockAppSettings;
};

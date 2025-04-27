// @flow

import type {
	BreakpointTypes,
	TBreakpoint,
} from '../extensions/libs/block-states/types';
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

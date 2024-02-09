// @flow

import type {
	BreakpointTypes,
	TBreakpoint,
} from '@publisher/extensions/src/libs/block-states/types';

/**
 * Get breakpoints.
 *
 * @param {{breakpoints: Array<BreakpointTypes>}} state the breakpoints
 * @return {BreakpointTypes} the breakpoints stored in redux.
 */
export const getBreakpoints = ({
	breakpoints,
}: {
	breakpoints: Array<BreakpointTypes>,
}): Array<BreakpointTypes> => {
	return breakpoints;
};

/**
 * Get breakpoints.
 *
 * @param {{breakpoints: Array<BreakpointTypes>}} state the breakpoints
 * @param {TBreakpoint} name the breakpoint name (type column).
 * @return {BreakpointTypes} the breakpoints stored in redux.
 */
export const getBreakpoint = (
	{
		breakpoints,
	}: {
		breakpoints: Array<BreakpointTypes>,
	},
	name: TBreakpoint
): BreakpointTypes | void => {
	return breakpoints.find(
		(breakpoint: BreakpointTypes): boolean => breakpoint.type === name
	);
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
	return canvasEditorSettings.deviceType || 'laptop';
};

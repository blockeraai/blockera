// @flow

/**
 * External dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import type { BreakpointTypes } from '@blockera/extensions/src/libs/block-states/types';

export const breakpoints = (state: Object = [], action: Object): Object => {
	switch (action?.type) {
		case 'ADD_BREAKPOINT':
			return [...state, action.breakpoint];

		case 'EDIT_BREAKPOINT':
			return state.map((breakpoint: BreakpointTypes): BreakpointTypes => {
				if (breakpoint.type !== action.breakpointType) {
					return breakpoint;
				}

				return {
					...breakpoint,
					...action.editedBreakpoint,
				};
			});

		case 'DELETE_BREAKPOINT':
			return state.filter(
				(breakpoint: BreakpointTypes): boolean =>
					breakpoint.type === action.breakpointType
			);

		case 'UPDATE_BREAKPOINTS':
			return action.breakpointTypes;
	}

	return state;
};

export const canvasEditorSettings = (
	state: Object = {},
	action: Object
): Object => {
	switch (action.type) {
		case 'SWITCH_BREAKPOINT':
			return {
				...state,
				deviceType: action.device || 'laptop',
			};
		case 'REGISTER_CANVAS_SETTINGS':
			return {
				...state,
				...action.settings,
			};
	}

	return state;
};

export default (combineReducers({
	breakpoints,
	canvasEditorSettings,
}): Object);

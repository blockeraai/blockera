// @flow

/**
 * External dependencies
 */
import { combineReducers } from '@wordpress/data';

export const breakpoints = (state: Object = [], action: Object): Object => {
	switch (action?.type) {
		case 'SET_BREAKPOINTS':
			return action.breakpoints;

		case 'EDIT_BREAKPOINT':
			return {
				...state,
				[action.breakpointType]: {
					...state[action.id],
					...action.editedBreakpoint,
				},
			};

		case 'DELETE_BREAKPOINT':
			delete state[action.breakpointType];

			return state;

		case 'UPDATE_BREAKPOINTS':
			return action.breakpoints;
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

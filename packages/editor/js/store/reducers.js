// @flow

/**
 * External dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isEquals, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from '../canvas-editor';

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

export const blockStates = (state: Object = {}, action: Object): Object => {
	switch (action.type) {
		case 'SET_BLOCK_STATES':
			const newState = mergeObject(state, action.states);

			if (isEquals(newState, state)) {
				return state;
			}

			return mergeObject(state, action.states);
		case 'EDIT_BLOCK_STATE':
			return {
				...state,
				[action.stateName]: {
					...state[action.stateName],
					...action.editedState,
				},
			};
		case 'DELETE_BLOCK_STATE':
			delete state[action.stateName];

			return state;
	}

	return state;
};

export const innerBlockStates = (
	state: Object = {},
	action: Object
): Object => {
	switch (action.type) {
		case 'SET_INNER_BLOCK_STATES':
			const newState = mergeObject(state, action.states);

			if (isEquals(newState, state)) {
				return state;
			}

			return mergeObject(state, action.states);
		case 'EDIT_INNER_BLOCK_STATE':
			return {
				...state,
				[action.stateName]: {
					...state[action.stateName],
					...action.editedState,
				},
			};
		case 'DELETE_INNER_BLOCK_STATE':
			delete state[action.stateName];

			return state;
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
				deviceType: action.device || getBaseBreakpoint(),
			};
		case 'UPDATER_DEVICE_TYPE':
			return {
				...state,
				updatePickedDeviceType: action.updater,
			};
		case 'UPDATER_DEVICE_INDICATOR':
			return {
				...state,
				updateDeviceIndicator: action.updater,
			};
		case 'REGISTER_CANVAS_SETTINGS':
			return {
				...state,
				...action.settings,
			};
	}

	return state;
};

export const blockAppSettings = (
	state: Object = {},
	action: Object
): Object => {
	switch (action.type) {
		case 'SET_BLOCK_APP_SETTINGS':
			return action.settings;
	}

	return state;
};

export const globalStyles = (state: Object = {}, action: Object): Object => {
	switch (action.type) {
		case 'SET_SELECTED_BLOCK_STYLE':
			state = {
				...state,
				selectedBlockStyle: action.selectedBlockStyle,
			};
			break;
		case 'SET_GLOBAL_STYLES':
			state = {
				...state,
				styles: action.styles,
			};
			break;
		case 'SET_BLOCK_STYLES':
			state = {
				...state,
				styles: {
					...(state?.styles || {}),
					blocks: {
						...(state?.styles?.blocks || {}),
						[action.blockName]: {
							...(state?.styles?.blocks?.[action.blockName] ||
								{}),
							...action.styles,
						},
					},
				},
			};
			break;
		case 'SET_SELECTED_BLOCK_STYLE_VARIATION':
			state = {
				...state,
				selectedBlockStyleVariation: action.selectedBlockStyleVariation,
			};
			break;
	}

	return state;
};

export default (combineReducers({
	breakpoints,
	blockStates,
	globalStyles,
	innerBlockStates,
	blockAppSettings,
	canvasEditorSettings,
}): Object);

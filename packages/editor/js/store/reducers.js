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
import { getBaseBreakpoint } from '../editor/header-ui';

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
		case 'SET_SELECTED_BLOCK_REF':
			state = {
				...state,
				selectedBlockRef: action.selectedBlockRef,
			};
			break;
		case 'SET_GLOBAL_STYLES':
			state = {
				...state,
				userStyles: action.styles,
			};
			break;
		case 'SET_BLOCK_STYLES':
			state = {
				...state,
				userStyles: {
					...(state?.userStyles || {}),
					styles: {
						...(state?.userStyles?.styles || {}),
						blocks: {
							...(state?.userStyles?.styles?.blocks || {}),
							[action.blockName]: {
								...('default' === action.variation
									? {
											...action.styles,
											variations:
												action?.styles?.variations ||
												state?.userStyles?.styles
													?.blocks?.[action.blockName]
													?.variations ||
												{},
										}
									: {
											...(state?.userStyles?.styles
												?.blocks?.[action.blockName] ||
												{}),
											variations: {
												...(state?.userStyles?.styles
													?.blocks?.[action.blockName]
													?.variations || {}),
												[action.variation]:
													action.styles,
											},
										}),
							},
						},
					},
				},
			};
			break;
		case 'CLEAR_ALL_CUSTOMIZATIONS':
			const currentBlock = state?.userStyles?.blocks?.[action.blockName];
			const currentVariations = currentBlock?.variations || {};

			if ('default' === action.variation) {
				// Clear all properties except variations
				state = {
					...state,
					userStyles: {
						...(state?.userStyles || {}),
						styles: {
							...(state?.userStyles?.styles || {}),
							blocks: {
								...(state?.userStyles?.styles?.blocks || {}),
								...(Object.keys(currentVariations).length
									? {
											[action.blockName]: {
												variations: currentVariations,
											},
										}
									: {}),
							},
						},
					},
				};
			} else {
				// Remove the specific variation, keep root and other variations
				const updatedVariations = { ...currentVariations };
				delete updatedVariations[action.variation];

				state = {
					...state,
					userStyles: {
						...(state?.userStyles || {}),
						styles: {
							...(state?.userStyles?.styles || {}),
							blocks: {
								...(state?.userStyles?.styles?.blocks || {}),
								[action.blockName]: {
									...(currentBlock || {}),
									variations: updatedVariations,
								},
							},
						},
					},
				};
			}
			break;
		case 'SET_SELECTED_BLOCK_STYLE_VARIATION':
			state = {
				...state,
				selectedBlockStyleVariation: action.selectedBlockStyleVariation,
			};
			break;
		case 'SET_STYLE_VARIATION_BLOCKS':
			state = {
				...state,
				styleVariationBlocks: {
					...(state?.styleVariationBlocks || {}),
					[action.variationName]:
						'auto' === action?.setterType
							? [
									...new Set([
										...(state?.styleVariationBlocks?.[
											action.variationName
										] || []),
										...action.blocks,
									]),
								]
							: action.blocks,
				},
			};
			break;
		case 'DELETE_STYLE_VARIATION_BLOCKS':
			let filteredBlocks: Array<string> = [];

			if (
				action.disabledIn.length &&
				state?.styleVariationBlocks?.[action.variationName]
			) {
				filteredBlocks = state.styleVariationBlocks?.[
					action.variationName
				].filter(
					(block: string): boolean =>
						!action.disabledIn.includes(block)
				);
			}

			state = {
				...state,
				styleVariationBlocks: {
					...(state?.styleVariationBlocks || {}),
					[action.variationName]: action.single
						? state?.styleVariationBlocks?.[
								action.variationName
							]?.filter((block) => block !== action.blockName)
						: filteredBlocks,
				},
			};
			break;
	}

	return state;
};

export const editorEvents = (state: Object = {}, action: Object): Object => {
	switch (action.type) {
		case 'SET_EDITOR_SELECTED_BLOCK_EVENT':
			return {
				...state,
				selectedBlockEvent: action.event,
			};
	}

	return state;
};

export default (combineReducers({
	breakpoints,
	blockStates,
	editorEvents,
	globalStyles,
	innerBlockStates,
	blockAppSettings,
	canvasEditorSettings,
}): Object);

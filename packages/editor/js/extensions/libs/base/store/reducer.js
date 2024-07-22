// @flow

/**
 * External dependencies
 */
import { combineReducers } from '@wordpress/data';

const CoreConfigDefinition = (state: Object = {}, action: Object): Object => {
	switch (action.type) {
		case 'ADD_EXTENSION':
			return {
				...state,
				[action.blockName]: {
					...(state[action.blockName] || {}),
					[action.name]: action.supports,
				},
			};
		case 'UPDATE_EXTENSION':
			return {
				...state,
				[action.blockName]: {
					...(state[action.blockName] || {}),
					[action.name]: action.newSupports,
				},
			};
	}

	return state;
};

const CustomConfigDefinitions = (
	state: Object = {},
	action: Object
): Object => {
	switch (action.type) {
		case 'ADD_DEFINITION':
			return {
				...state,
				[action.blockName]: {
					[action.definition]: {
						...((state[action.blockName] || {})[
							action.definition
						] || {}),
						[action.name]: action.extensions,
					},
				},
			};
		case 'UPDATE_DEFINITION_EXTENSION_SUPPORT':
			return {
				...state,
				[action.blockName]: {
					...(state[action.blockName] || {}),
					[action.definitionName]: {
						...((state[action.blockName] || {})[
							action.definitionName
						] || {}),
						[action.name]: action.newSupports,
					},
				},
			};
	}

	return state;
};

export default (combineReducers({
	CoreConfigDefinition,
	CustomConfigDefinitions,
}): Object);

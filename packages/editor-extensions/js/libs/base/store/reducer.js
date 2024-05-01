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
				[action.name]: action.supports,
			};
		case 'ADD_EXTENSION_SUPPORT':
			return {
				...state,
				[action.extensionName]: {
					...state[action.extensionName],
					[action.name]: action.support,
				},
			};
		case 'UPDATE_EXTENSION':
			return {
				...state,
				[action.name]: action.newSupports,
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
				[action.name]: action.extensions,
			};
		case 'ADD_DEFINITION_EXTENSION_SUPPORT':
			return {
				...state,
				[action.definitionName]: {
					...state[action.definitionName],
					[action.name]: action.support,
				},
			};
		case 'UPDATE_DEFINITION_EXTENSION_SUPPORT':
			return {
				...state,
				[action.definitionName]: {
					...state[action.definitionName],
					[action.name]: action.newSupport,
				},
			};
	}

	return state;
};

export default (combineReducers({
	CoreConfigDefinition,
	CustomConfigDefinitions,
}): Object);

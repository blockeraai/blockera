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
				[action.clientId]: {
					...(state[action.clientId] || {}),
					[action.name]: action.supports,
				},
			};
		case 'ADD_EXTENSION_SUPPORT':
			return {
				...state,
				[action.clientId]: {
					...(state[action.clientId] || {}),
					[action.extensionName]: {
						...((state[action.clientId] || {})[
							action.extensionName
						] || {}),
						[action.name]: action.support,
					},
				},
			};
		case 'UPDATE_EXTENSION':
			return {
				...state,
				[action.clientId]: {
					...(state[action.clientId] || {}),
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
				[action.clientId]: {
					[action.definition]: {
						...((state[action.clientId] || {})[action.definition] ||
							{}),
						[action.name]: action.extensions,
					},
				},
			};
		case 'UPDATE_DEFINITION_EXTENSION_SUPPORT':
			return {
				...state,
				[action.clientId]: {
					...(state[action.clientId] || {}),
					[action.definitionName]: {
						...((state[action.clientId] || {})[
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

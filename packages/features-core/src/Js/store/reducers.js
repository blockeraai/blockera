// @flow

/**
 * External dependencies
 */
import { combineReducers } from '@wordpress/data';

const features = (state: Object = [], action: Object): Object => {
	switch (action?.type) {
		case 'REGISTER_FEATURE':
			return {
				...state,
				[action.featureId]: action.payload,
			};
	}

	return state;
};

export default (combineReducers({
	features,
}): Object);

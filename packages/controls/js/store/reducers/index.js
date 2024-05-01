/**
 * External dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { controlReducer } from './control-reducer';

export default combineReducers({
	controlReducer,
});

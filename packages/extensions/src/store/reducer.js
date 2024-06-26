/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { omit } from '@publisher/utils';

/**
 * Key block types by their name.
 *
 * @param {*} types
 * @return {Object} extensions
 */
function keyBlockExtensionsByName(types) {
	return types.reduce(
		(newBlockExtensions, block) => ({
			...newBlockExtensions,
			[block.name]: block,
		}),
		{}
	);
}

/**
 * Reducer managing the unprocessed block extension in a form passed when registering the by block.
 * It's for internal use only. It allows recomputing the processed block extensions on-demand after block extension filters
 * get added or removed.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function unprocessedBlockExtensions(state = {}, action) {
	switch (action.type) {
		case 'ADD_UNPROCESSED_BLOCK_EXTENSION':
			return {
				...state,
				[action.blockExtension.name]: action.blockExtension,
			};
		case 'REMOVE_BLOCK_EXTENSIONS':
			return omit(state, action.names);
	}

	return state;
}

/**
 * Reducer managing the processed block extensions with all filters applied.
 * The state is derived from the `unprocessedBlockTypes` reducer.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function blockExtensions(state = {}, action) {
	switch (action.type) {
		case 'ADD_BLOCK_EXTENSIONS':
			return {
				...state,
				...keyBlockExtensionsByName(action.blockExtensions),
			};
		case 'REMOVE_BLOCK_EXTENSIONS':
			return omit(state, action.names);
	}

	return state;
}

export default combineReducers({
	unprocessedBlockExtensions,
	blockExtensions,
});

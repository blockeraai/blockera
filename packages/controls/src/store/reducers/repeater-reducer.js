/**
 * Internal dependencies
 */
import {
	addItem,
	sortItem,
	cloneItem,
	changeItem,
	removeItem,
} from './repeater-reducers';

// eslint-disable-next-line jsdoc/require-returns-check
/**
 * Repeater controls state management
 *
 * @param {Object} state the state of control
 * @param {Object} action the action details for reduce state
 * @return {{}} the current state of control
 */
export function repeaterReducer(state = {}, action): Object {
	switch (action.type) {
		case 'ADD_REPEATER_ITEM':
			return addItem(state, action);

		case 'REMOVE_REPEATER_ITEM':
			return removeItem(state, action);

		case 'CHANGE_REPEATER_ITEM':
			return changeItem(state, action);

		case 'CLONE_REPEATER_ITEM':
			return cloneItem(state, action);

		case 'SORT_REPEATER_ITEM':
			return sortItem(state, action);

		default:
			return state;
	}
}

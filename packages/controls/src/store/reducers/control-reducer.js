// @flow
/**
 * Publisher dependencies
 */
import { isFunction, isUndefined, omit } from '@publisher/utils';

/**
 * The global state management control context provider!
 *
 * @param {Object} state the state of control
 * @param {Object} action the action details for reduce state
 * @return {{}} the current state of control
 */
export function controlReducer(state: Object = {}, action: Object): Object {
	switch (action.type) {
		case 'ADD_UNPROCESSED_CONTROL':
			return {
				...state,
				[action.control.name]: {
					...action.control,
				},
			};

		case 'REMOVE_CONTROL':
			return omit(state, action.names);

		case 'MODIFY_CONTROL_VALUE':
			const { valueCleanup } = action;
			const value = isFunction(valueCleanup)
				? valueCleanup(action.value)
				: action.value;

			//When you need to modify total columns of value up to date!
			if (isUndefined(action.propId)) {
				return {
					...state,
					[action.controlId]: {
						...state[action.controlId],
						value,
					},
				};
			}

			return {
				...state,
				[action.controlId]: {
					...state[action.controlId],
					value: {
						...state[action.controlId].value,
						[action.propId]: value,
					},
				},
			};

		case 'MODIFY_CONTROL_INFO':
			if (action.info.name || !action.controlId) {
				return state;
			}

			return {
				...state,
				[action.controlId]: {
					...state[action.controlId],
					...action.info,
				},
			};

		default:
			return state;
	}
}

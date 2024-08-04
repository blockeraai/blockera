// @flow
/**
 * Blockera dependencies
 */
import { update, prepare } from '@blockera/data-editor';
import { isEquals, isUndefined, omit } from '@blockera/utils';

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
			const value = action.value;

			//When you need to modify total columns of value up to date!
			if (isUndefined(action.propId)) {
				if (isEquals(state[action.controlId].value, value)) {
					return state;
				}

				return {
					...state,
					[action.controlId]: {
						...state[action.controlId],
						value,
					},
				};
			}

			if (!state[action.controlId].value[action.propId]) {
				if (prepare(action.propId, state[action.controlId].value)) {
					return {
						...state,
						[action.controlId]: {
							...state[action.controlId],
							value: update(
								state[action.controlId].value,
								action.propId,
								value,
								true
							),
						},
					};
				}
			}

			if (
				!state[action.controlId].value[action.propId] ||
				isEquals(state[action.controlId].value[action.propId], value)
			) {
				return state;
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
			if (
				action.info.name ||
				!action.controlId ||
				isEquals(state[action.controlId], action.info)
			) {
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

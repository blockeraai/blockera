/**
 * Publisher dependencies
 */
import { update } from '@publisher/data-extractor';
import { isFunction, isObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isQuery, getControlInfo, hasRepeaterId } from './utils';

function getNewValue({ valueCleanup, value }) {
	//handle valueCleanup when is set!
	return isFunction(valueCleanup) ? valueCleanup(value) : value;
}

function handleActionIncludeRepeaterId(controlValue, action) {
	if (isQuery(action)) {
		return update(controlValue, action.repeaterId, getNewValue(action));
	}

	return {
		...controlValue,
		[action.repeaterId]: controlValue[action.repeaterId].map((item, id) => {
			if (id === action.itemId) {
				return getNewValue(action);
			}

			return item;
		}),
	};
}

export function changeItem(state = {}, action) {
	const controlInfo = getControlInfo(state, action);

	if (!isObject(controlInfo)) {
		return state;
	}

	// state management by action include repeaterId
	if (hasRepeaterId(controlInfo.value, action, false)) {
		return {
			...state,
			[action.controlId]: {
				...controlInfo,
				value: handleActionIncludeRepeaterId(controlInfo.value, action),
			},
		};
	}

	//by default behavior of "changeRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: controlInfo.value.map((i, id) => {
				if (id === action.itemId) {
					return getNewValue(action);
				}

				return i;
			}),
		},
	};
}

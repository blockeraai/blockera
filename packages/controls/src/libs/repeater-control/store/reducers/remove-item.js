/**
 * Publisher dependencies
 */
import { isObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isQuery, getControlInfo, hasRepeaterId } from './utils';
import { prepare, update } from '@publisher/data-extractor';

function handleActionIncludeRepeaterId(controlValue, action) {
	const removeItem = (item, index) => action.itemId !== index;

	if (isQuery(action)) {
		const targetRepeaterValue = prepare(
			action.repeaterId,
			controlValue
		).filter(removeItem);

		return update(controlValue, action.repeaterId, targetRepeaterValue);
	}

	return {
		...controlValue,
		[action.repeaterId]: controlValue[action.repeaterId].filter(removeItem),
	};
}

export function removeItem(state = {}, action) {
	const controlInfo = getControlInfo(state, action);

	if (!isObject(controlInfo)) {
		return state;
	}

	// state management by action include repeaterId
	if (hasRepeaterId(controlInfo.value, action)) {
		return {
			...state,
			[action.controlId]: {
				...controlInfo,
				value: handleActionIncludeRepeaterId(controlInfo.value, action),
			},
		};
	}

	//by default behavior of "removeRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: controlInfo.value.filter(
				(i, index) => index !== action.itemId
			),
		},
	};
}

// @flow

/**
 * Internal dependencies
 */
import { hasRepeaterId } from './utils';
import { prepare, update } from '@publisher/data-extractor';

function handleActionIncludeRepeaterId(
	controlValue: Object,
	action: Object
): Object {
	const targetRepeaterValue = prepare(action.repeaterId, controlValue);

	delete targetRepeaterValue[action.itemId];

	return update(controlValue, action.repeaterId, targetRepeaterValue);
}

export function removeItem(state: Object = {}, action: Object): Object {
	const controlInfo = state[action.controlId];

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

	const value = { ...controlInfo.value };

	delete value[action.itemId];

	//by default behavior of "removeRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value,
		},
	};
}

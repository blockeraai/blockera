/**
 * Publisher dependencies
 */
import { prepare, update } from '@publisher/data-extractor';
import { isObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isQuery, hasLimitation, getControlInfo, hasRepeaterId } from './utils';

function handleActionIncludeRepeaterId(controlValue, action) {
	//mean: repeaterId of action should like this pattern /\w+\.\w+|\[.*]/gi
	if (isQuery(action)) {
		const targetRepeater = prepare(action.repeaterId, controlValue);

		//To limit the number of control items, it is enough to set the maxItems number and this value is less than the current number of state items.
		if (hasLimitation(action) && targetRepeater.length >= action.maxItems) {
			return controlValue;
		}

		return update(controlValue, action.repeaterId, [action.value], 'merge');
	}

	//To limit the number of control items, it is enough to set the maxItems number and this value is less than the current number of state items.
	if (
		hasLimitation(action) &&
		prepare(action.repeaterId, controlValue)?.length >= action.maxItems
	) {
		return controlValue;
	}

	return {
		...controlValue,
		[action.repeaterId]: [
			...controlValue[action.repeaterId],
			...[action.value],
		],
	};
}

export function addItem(state = {}, action) {
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

	//To limit the number of control items, it is enough to set the maxItems number and this value is less than the current number of state items.
	if (
		hasLimitation(action) &&
		controlInfo?.value?.length >= action.maxItems
	) {
		return state;
	}

	//by default behavior of "addRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: [...(controlInfo?.value ?? []), ...[action.value]],
		},
	};
}

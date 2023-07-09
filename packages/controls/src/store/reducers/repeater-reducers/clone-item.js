/**
 * Publisher dependencies
 */
import { isObject } from '@publisher/utils';
import { prepare, update } from '@publisher/data-extractor';

/**
 * Internal dependencies
 */
import { getControlInfo, hasLimitation, hasRepeaterId, isQuery } from './utils';

function handleActionIncludeRepeaterId(controlValue, action) {
	//mean: repeaterId of action should like this pattern /\w+\.\w+|\[.*]/gi
	if (isQuery(action)) {
		const targetRepeater = prepare(action.repeaterId, controlValue);

		//To limit the number of control items, it is enough to set the maxItems number and this value is less than the current number of state items.
		if (hasLimitation(action) && targetRepeater.length >= action.maxItems) {
			return controlValue;
		}

		return update(controlValue, action.repeaterId, [
			...targetRepeater.slice(0, action.itemId + 1),
			targetRepeater[action.itemId],
			...targetRepeater.slice(action.itemId + 1),
		]);
	}

	//To limit the number of control items, it is enough to set the maxItems number and this value is less than the current number of state items.
	if (
		hasLimitation(action) &&
		controlValue[action.repeaterId]?.length >= action.maxItems
	) {
		return controlValue;
	}

	return {
		...controlValue,
		[action.repeaterId]: [
			...controlValue[action.repeaterId].slice(0, action.itemId + 1),
			controlValue[action.repeaterId][action.itemId],
			...controlValue[action.repeaterId].slice(action.itemId + 1),
		],
	};
}

export function cloneItem(state = {}, action) {
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
	//when clone of last item!
	if (action.itemId >= controlInfo?.value.length) {
		return state;
	}

	//by default behavior of "cloneRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: [
				...controlInfo.value.slice(0, action.itemId + 1),
				controlInfo.value[action.itemId],
				...controlInfo.value.slice(action.itemId + 1),
			],
		},
	};
}

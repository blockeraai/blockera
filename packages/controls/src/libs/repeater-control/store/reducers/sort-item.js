// @flow

/**
 * Publisher dependencies
 */
import { update } from '@publisher/data-extractor';

/**
 * Internal dependencies
 */
import { hasRepeaterId } from './utils';

function sortingRepeater(
	[itemId, item]: [string, Object],
	action: Object
): [string, Object] {
	const fromOrder = action.items[action.toIndex].order;
	const toOrder = action.items[action.fromIndex].order;

	if (action.fromIndex === itemId) {
		return [
			itemId,
			{
				...item,
				order: fromOrder,
			},
		];
	}
	if (action.toIndex === itemId) {
		return [
			itemId,
			{
				...item,
				order: toOrder,
			},
		];
	}

	return [itemId, item];
}

function handleActionIncludeRepeaterId(
	controlValue: Object,
	action: Object
): Object {
	const value = Object.entries(action.items).map((arr) =>
		sortingRepeater(arr, action)
	);

	return update(controlValue, action.repeaterId, Object.fromEntries(value));
}

export function sortItem(state: Object = {}, action: Object): Object {
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

	const value = Object.entries(action.items).map((arr) =>
		sortingRepeater(arr, action)
	);

	//by default behavior of "sortRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...state[action.controlId],
			value: Object.fromEntries(value),
		},
	};
}

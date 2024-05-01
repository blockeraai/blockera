// @flow

/**
 * Blockera dependencies
 */
import { update } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import { hasRepeaterId } from './utils';

function getItemId(
	newItemId: string,
	{ itemId, item }: { itemId: string, item: any }
): string {
	if (!item?.type) {
		return newItemId;
	}

	const regexp = new RegExp(`^${item.type}`, 'i');

	if (!regexp.test(newItemId)) {
		return itemId;
	}

	return newItemId;
}

function sortingRepeater(
	[itemId, item]: [string, Object],
	action: Object
): [string, Object] {
	const fromOrder = action.items[action.toIndex].order;
	const toOrder = action.items[action.fromIndex].order;

	if (action.fromIndex === itemId) {
		return [
			getItemId(action.toIndex, { item, itemId }),
			{
				...item,
				order: fromOrder,
			},
		];
	}
	if (action.toIndex === itemId) {
		return [
			getItemId(action.fromIndex, { item, itemId }),
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

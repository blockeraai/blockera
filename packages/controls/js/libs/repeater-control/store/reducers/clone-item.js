/**
 * Blockera dependencies
 */
import { isFunction } from '@blockera/utils';
import { prepare, update } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import {
	reOrder,
	hasLimitation,
	hasRepeaterId,
	repeaterOnChange,
	generatedDetailsId,
} from './utils';

function handleActionIncludeRepeaterId(controlValue, action) {
	const targetRepeater = prepare(action.repeaterId, controlValue);
	const itemsCount = Object.values(targetRepeater || {}).length;

	//To limit the number of control items, it is enough to set the maxItems number and this value is less than the current number of state items.
	if (
		(hasLimitation(action) && itemsCount >= action.maxItems) ||
		!targetRepeater
	) {
		return controlValue;
	}

	let clonedItem = targetRepeater[action.itemId];

	if (0 === action.itemId && action?.overrideItem) {
		clonedItem = {
			...clonedItem,
			...action.overrideItem,
		};
	}

	if (clonedItem?.selectable) {
		targetRepeater[action.itemId].isSelected = false;
	}

	let itemId = itemsCount;

	if ('function' === typeof action.itemIdGenerator) {
		itemId = action.itemIdGenerator(itemsCount);
	}

	return reOrder(
		{
			...update(controlValue, action.repeaterId, {
				[itemId]: {
					...clonedItem,
					order: (action.item?.order || 0) + 1,
				},
			}),
		},
		itemId,
		action.repeaterId
	);
}

export function cloneItem(state = {}, action) {
	const controlInfo = state[action.controlId];

	// state management by action include repeaterId
	if (hasRepeaterId(controlInfo.value, action)) {
		const newValue = repeaterOnChange(
			handleActionIncludeRepeaterId(controlInfo.value, action),
			action
		);

		return {
			...state,
			[action.controlId]: {
				...controlInfo,
				value: newValue,
			},
		};
	}

	const { itemsCount, uniqueId } = generatedDetailsId(state, action);

	//To limit the number of control items, it is enough to set the maxItems number and this value is less than the current number of state items.
	if (hasLimitation(action) && itemsCount >= action.maxItems) {
		return state;
	}
	//when clone of last item!
	// if (action.itemId >= controlInfo?.value.length) {
	// 	return state;
	// }

	let clonedItem = controlInfo.value[action.itemId];

	if (0 === action.itemId && action?.overrideItem) {
		clonedItem = {
			...clonedItem,
			...(isFunction(action.overrideItem)
				? action.overrideItem(action.item, action.itemId) || {}
				: action.overrideItem),
		};
	}

	if (clonedItem?.selectable) {
		controlInfo.value[action.itemId].isSelected = false;
	}

	const newValue = {
		...controlInfo.value,
		[uniqueId]: {
			...clonedItem,
			order: (action.item?.order || 0) + 1,
		},
	};

	repeaterOnChange(reOrder(newValue, uniqueId), action);

	//by default behavior of "cloneRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: reOrder(newValue, uniqueId),
		},
	};
}

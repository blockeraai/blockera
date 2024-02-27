/**
 * Publisher dependencies
 */
import { isFunction, isObject } from '@publisher/utils';
import { prepare, update } from '@publisher/data-extractor';

/**
 * Internal dependencies
 */
import {
	generatedDetailsId,
	getControlInfo,
	hasLimitation,
	hasRepeaterId,
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

	let itemId = itemsCount + '';

	if ('function' === typeof action.itemIdGenerator) {
		itemId = action.itemIdGenerator(itemsCount);
	}

	return update(controlValue, action.repeaterId, {
		[itemId]: {
			...clonedItem,
			order: itemsCount,
		},
	});
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

	//when clone isLastItemSupported item
	if (clonedItem?.isLastItemSupport) {
		return {
			...state,
			[action.controlId]: {
				...controlInfo,
				value: [
					...controlInfo.value.slice(0, controlInfo.value.length - 1),
					{
						...controlInfo.value.slice(-1)[0],
						isLastItemSupport: false,
					},
					clonedItem,
				],
			},
		};
	}

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

	//by default behavior of "cloneRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: {
				...controlInfo.value,
				[uniqueId]: {
					...clonedItem,
					order: Object.keys(controlInfo.value).length,
				},
			},
		},
	};
}

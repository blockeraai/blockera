/**
 * Publisher dependencies
 */
import { isFunction, isObject } from '@publisher/utils';
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

		return update(controlValue, action.repeaterId, [
			...targetRepeater.slice(0, action.itemId + 1),
			clonedItem?.selectable
				? { ...clonedItem, isSelected: true }
				: clonedItem,
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

	let clonedItem = controlValue[action.repeaterId][action.itemId];

	if (0 === action.itemId && action?.overrideItem) {
		clonedItem = {
			...clonedItem,
			...action.overrideItem,
		};
	}

	if (clonedItem?.selectable) {
		controlValue[action.repeaterId][action.itemId].isSelected = false;
	}

	return {
		...controlValue,
		[action.repeaterId]: [
			...controlValue[action.repeaterId].slice(0, action.itemId + 1),
			clonedItem?.selectable
				? { ...clonedItem, isSelected: true }
				: clonedItem,
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
			value: [
				...controlInfo.value.slice(0, action.itemId + 1),
				clonedItem?.selectable
					? { ...clonedItem, isSelected: true }
					: clonedItem,
				...controlInfo.value.slice(action.itemId + 1),
			],
		},
	};
}

// @flow

/**
 * Blockera dependencies
 */
import { prepare, update } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import {
	hasLimitation,
	hasRepeaterId,
	repeaterOnChange,
	getNewIdDetails,
} from './utils';

/**
 * Handle action with has repeaterId prop.
 *
 * @param {Object} controlValue The parent control value.
 * @param {Object} action The action for dispatcher.
 * @return {Object} the updated controlValue.
 */
function handleActionIncludeRepeaterId(
	controlValue: Object,
	action: Object
): Object {
	const targetRepeater = prepare(action.repeaterId, controlValue);
	const itemsCount = Object.values(targetRepeater || {}).length;

	//To limit the number of control items, it is enough to set the maxItems number and this value is less than the current number of state items.
	if (
		(hasLimitation(action) && itemsCount >= action.maxItems) ||
		!targetRepeater
	) {
		return controlValue;
	}

	const newValue = {
		...action.value,
		order: itemsCount,
	};

	return update(
		controlValue,
		action.repeaterId,
		'function' === typeof action.itemIdGenerator
			? {
					[action.itemIdGenerator(itemsCount)]: newValue,
			  }
			: { [itemsCount + '']: newValue }
	);
}

export function addItem(state: Object = {}, action: Object): Object {
	const controlInfo = state[action.controlId];

	// Assume action includes repeaterId prop.
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

	const { itemsCount, uniqueId } = getNewIdDetails(state, action);

	//To limit the number of control items, it is enough to set the maxItems number and this value is less than the current number of state items.
	if (hasLimitation(action) && itemsCount >= action.maxItems) {
		return state;
	}

	const itemId: string =
		'function' === typeof action.itemIdGenerator
			? action.itemIdGenerator(itemsCount)
			: uniqueId;

	repeaterOnChange(
		{
			...controlInfo.value,
			[itemId]: {
				...action.value,
				order: Object.keys(controlInfo.value).length,
			},
		},
		action
	);

	//by default behavior of "addRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: {
				...controlInfo.value,
				[itemId]: {
					...action.value,
					order: Object.keys(controlInfo.value).length,
				},
			},
		},
	};
}

// @flow

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';
import { update, prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import { hasRepeaterId, repeaterOnChange } from './utils';

function handleActionIncludeRepeaterId(
	controlValue: Object,
	action: Object
): Object {
	const targetRepeater = prepare(action.repeaterId, controlValue);

	if (!targetRepeater || !targetRepeater[action.itemId]) {
		return controlValue;
	}

	// Get the current item to preserve order if it exists
	const currentItem = targetRepeater[action.itemId];
	const resetValue = {
		...action.defaultValue,
		order: currentItem?.order,
	};

	if (isEquals(targetRepeater[action.itemId], resetValue)) {
		return controlValue;
	}

	return update(controlValue, action.repeaterId, {
		[action.itemId]: resetValue,
	});
}

export function resetItem(state: Object = {}, action: Object): Object {
	const controlInfo = state[action.controlId];

	// state management by action include repeaterId
	if (hasRepeaterId(controlInfo.value, action, false)) {
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

	// Get the current item to preserve order if it exists
	const currentItem = controlInfo.value[action.itemId];
	const resetValue = {
		...action.defaultValue,
		order: currentItem?.order,
	};

	if (isEquals(controlInfo.value[action.itemId], resetValue)) {
		return state;
	}

	repeaterOnChange(
		{
			...controlInfo.value,
			[action.itemId]: resetValue,
		},
		action
	);

	//by default behavior of "resetRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: {
				...controlInfo.value,
				[action.itemId]: resetValue,
			},
		},
	};
}

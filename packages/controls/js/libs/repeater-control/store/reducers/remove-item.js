// @flow

/**
 * Blockera dependencies
 */
import { prepare, update } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import { hasRepeaterId, repeaterOnChange, regeneratedIds } from './utils';

function handleActionIncludeRepeaterId(
	controlValue: Object,
	action: Object
): Object {
	const targetRepeaterValue = prepare(action.repeaterId, controlValue);

	delete targetRepeaterValue[action.itemId];

	let newValue = targetRepeaterValue;

	if (action.disableRegenerateId) {
		newValue = regeneratedIds(targetRepeaterValue, action);
	}

	return update(controlValue, action.repeaterId, newValue, true);
}

export function removeItem(state: Object = {}, action: Object): Object {
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

	const value = { ...controlInfo.value };

	delete value[action.itemId];

	let newValue = value;

	if (action.disableRegenerateId) {
		newValue = regeneratedIds(value, action);
	}

	repeaterOnChange(newValue, action);

	//by default behavior of "removeRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: newValue,
		},
	};
}

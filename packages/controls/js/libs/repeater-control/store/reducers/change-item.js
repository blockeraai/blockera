/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';
import { update, prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import { hasRepeaterId, repeaterOnChange } from './utils';

function handleActionIncludeRepeaterId(controlValue, action) {
	const targetRepeater = prepare(action.repeaterId, controlValue);

	if (
		targetRepeater &&
		isEquals(targetRepeater[action.itemId], action.value)
	) {
		return controlValue;
	}

	return update(controlValue, action.repeaterId, {
		[action.itemId]: action.value,
	});
}

export function changeItem(state = {}, action) {
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

	if (isEquals(controlInfo.value[action.itemId], action.value)) {
		return state;
	}

	const clonedPrevValue = { ...controlInfo.value };

	if (isEquals(action.value, clonedPrevValue[action.itemId])) {
		return state;
	}

	if (action?.staticType) {
		delete clonedPrevValue[action.itemId];
		action.itemId = action.staticType;
	}

	repeaterOnChange(
		{
			...clonedPrevValue,
			[action.itemId]: action.value,
		},
		action
	);

	//by default behavior of "changeRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: {
				...clonedPrevValue,
				[action.itemId]: action.value,
			},
		},
	};
}

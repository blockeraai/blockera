/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';
import { update, prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import {
	hasRepeaterId,
	repeaterOnChange,
	renameRepeaterItemByTypeValue,
	shouldRenameRepeaterItemByType,
} from './utils';

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

	if (
		shouldRenameRepeaterItemByType(
			action.itemId,
			action.value,
			action.staticType
		)
	) {
		const newValue = renameRepeaterItemByTypeValue(
			controlInfo.value,
			state,
			{
				...action,
				value: {
					...action.value,
					isOpen: true,
				},
			}
		);

		if (null === newValue || isEquals(newValue, controlInfo.value)) {
			return state;
		}

		repeaterOnChange(newValue, action);

		return {
			...state,
			[action.controlId]: {
				...controlInfo,
				value: newValue,
			},
		};
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

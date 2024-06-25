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
	generatedDetailsId,
	repeaterOnChange,
	regeneratedIds,
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

	if (
		action.value?.type &&
		!new RegExp(`^${action.value?.type}`, 'i').test(action.itemId)
	) {
		delete clonedPrevValue[action.itemId];

		let { uniqueId } = generatedDetailsId(state, action);

		if ('function' === typeof action.getId) {
			uniqueId = action.getId();
		}

		if (
			clonedPrevValue[uniqueId] &&
			isEquals(action.value, clonedPrevValue[uniqueId])
		) {
			return state;
		}

		repeaterOnChange(
			regeneratedIds(
				{
					...clonedPrevValue,
					[uniqueId]: { ...action.value, isOpen: true },
				},
				action
			),
			action
		);

		return {
			...state,
			[action.controlId]: {
				...controlInfo,
				value: regeneratedIds(
					{
						...clonedPrevValue,
						[uniqueId]: { ...action.value, isOpen: true },
					},
					action
				),
			},
		};
	}

	if (isEquals(action.value, clonedPrevValue[action.itemId])) {
		return state;
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

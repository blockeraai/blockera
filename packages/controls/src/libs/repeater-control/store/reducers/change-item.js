/**
 * Publisher dependencies
 */
import { isEquals } from '@publisher/utils';
import { update, prepare } from '@publisher/data-extractor';

/**
 * Internal dependencies
 */
import { hasRepeaterId, generatedDetailsId } from './utils';

function handleActionIncludeRepeaterId(controlValue, action) {
	const targetRepeater = prepare(action.repeaterId, controlValue);

	if (
		targetRepeater &&
		isEquals(targetRepeater[action.itemId], action.value)
	) {
		return state;
	}

	return update(controlValue, action.repeaterId, {
		[action.itemId]: action.value,
	});
}

export function changeItem(state = {}, action) {
	const controlInfo = state[action.controlId];

	// state management by action include repeaterId
	if (hasRepeaterId(controlInfo.value, action, false)) {
		return {
			...state,
			[action.controlId]: {
				...controlInfo,
				value: handleActionIncludeRepeaterId(controlInfo.value, action),
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

		return {
			...state,
			[action.controlId]: {
				...controlInfo,
				value: {
					...clonedPrevValue,
					[uniqueId]: action.value,
				},
			},
		};
	}

	if (isEquals(action.value, clonedPrevValue[action.itemId])) {
		return state;
	}

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

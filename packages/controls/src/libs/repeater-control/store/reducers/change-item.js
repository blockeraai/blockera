/**
 * Publisher dependencies
 */
import { update } from '@publisher/data-extractor';
import { isObject, isEquals } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { getControlInfo, hasRepeaterId, generatedDetailsId } from './utils';

function handleActionIncludeRepeaterId(controlValue, action) {
	return update(controlValue, action.repeaterId, {
		[action.itemId]: action.value,
	});
}

export function changeItem(state = {}, action) {
	const controlInfo = getControlInfo(state, action);

	if (!isObject(controlInfo)) {
		return state;
	}

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

/**
 * Publisher dependencies
 */
import { update } from '@publisher/data-extractor';
import { arraySortItems, isObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isQuery, getControlInfo, hasRepeaterId } from './utils';

function handleActionIncludeRepeaterId(controlValue, action) {
	//mean: repeaterId of action should like this pattern /\w+\.\w+|\[.*]/gi
	if (isQuery(action)) {
		return update(
			controlValue,
			action.repeaterId,
			arraySortItems({
				args: action.items,
				toIndex: action.toIndex,
				fromIndex: action.fromIndex,
			})
		);
	}

	return {
		...controlValue,
		[action.repeaterId]: arraySortItems({
			args: action.items,
			toIndex: action.toIndex,
			fromIndex: action.fromIndex,
		}),
	};
}

export function sortItem(state = {}, action) {
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

	//by default behavior of "sortRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...state[action.controlId],
			value: arraySortItems({
				args: action.items,
				toIndex: action.toIndex,
				fromIndex: action.fromIndex,
			}),
		},
	};
}

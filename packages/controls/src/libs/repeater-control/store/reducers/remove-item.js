// @flow

/**
 * Internal dependencies
 */
import { hasRepeaterId } from './utils';
import { prepare, update } from '@publisher/data-extractor';

// function remappedControlValue(
// 	value: Object,
// 	{
// 		itemIdGenerator,
// 	}: {
// 		itemIdGenerator?: (itemsCount: number) => string,
// 	}
// ): Object {
// 	const mappedNewValue = Object.entries(value)
// 		.sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
// 		.map(([, item]: [string, any], index: number): [string, any] => {
// 			item = {
// 				...item,
// 				order: index,
// 			};
//
// 			if (!item?.type) {
// 				if ('function' === typeof itemIdGenerator) {
// 					return [itemIdGenerator(index + 1), item];
// 				}
//
// 				return [index + '', item];
// 			}
//
// 			return [`${item.type}-${index}`, item];
// 		});
//
// 	return Object.fromEntries(mappedNewValue);
// }

function handleActionIncludeRepeaterId(
	controlValue: Object,
	action: Object
): Object {
	const targetRepeaterValue = prepare(action.repeaterId, controlValue);

	delete targetRepeaterValue[action.itemId];

	return update(controlValue, action.repeaterId, targetRepeaterValue);
}

export function removeItem(state: Object = {}, action: Object): Object {
	const controlInfo = state[action.controlId];

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

	const value = { ...controlInfo.value };

	delete value[action.itemId];

	//by default behavior of "removeRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value,
		},
	};
}

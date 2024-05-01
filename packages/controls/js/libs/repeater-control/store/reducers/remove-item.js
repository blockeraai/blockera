// @flow

/**
 * Blockera dependencies
 */
import { prepare, update } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import { countPropertiesWithPattern, hasRepeaterId } from './utils';

function regeneratedIds(value: Object, action: Object): Object {
	const { itemIdGenerator = null } = action;
	const sortedItems = Object.entries({ ...value }).sort(
		([, a], [, b]) => (a.order || 0) - (b.order || 0)
	);

	const newValue: { [key: string]: any } = {};

	sortedItems.forEach(([, item]: [string, any], index: number): void => {
		item = {
			...item,
			order: index,
		};

		if ('function' === typeof itemIdGenerator) {
			newValue[itemIdGenerator(index)] = item;

			return;
		}

		if (!item?.type) {
			newValue[index + ''] = item;

			return;
		}

		const itemsCount = countPropertiesWithPattern(
			newValue,
			new RegExp(`^${item.type}`, 'i')
		);

		newValue[`${item.type}-${itemsCount}`] = item;
	});

	return newValue;
}

function handleActionIncludeRepeaterId(
	controlValue: Object,
	action: Object
): Object {
	const targetRepeaterValue = prepare(action.repeaterId, controlValue);

	delete targetRepeaterValue[action.itemId];

	return update(
		controlValue,
		action.repeaterId,
		regeneratedIds(targetRepeaterValue, action),
		true
	);
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
			value: regeneratedIds(value, action),
		},
	};
}

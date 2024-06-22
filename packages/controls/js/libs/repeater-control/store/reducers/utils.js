// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Blockera dependencies
 */
import { prepare } from '@blockera/data-editor';
import { isObject, isInteger, isString } from '@blockera/utils';

/**
 * has limitation in action?
 *
 * @param {Object} action the action of dispatcher
 * @return {boolean} true on success, false when otherwise!
 */
export const hasLimitation = (action: Object): boolean => {
	return isInteger(action.maxItems) && action.maxItems !== -1;
};

/**
 * has repeaterId prop exists in action and check is valid?
 *
 * @param {Object} controlValue the control value.
 * @param {Object} action the action of dispatcher.
 * @param {boolean} checkIsNested the flag for check prepare data value is nested repeater?
 * @return {boolean|false} true on success, false when otherwise.
 */
export const hasRepeaterId = (
	controlValue: Object,
	action: Object,
	checkIsNested: boolean = true
): boolean => {
	return checkIsNested
		? isString(action.repeaterId) &&
				action.repeaterId.length &&
				isObject(prepare(action.repeaterId, controlValue))
		: isString(action.repeaterId) && action.repeaterId.length;
};

/**
 * Calculate props count with regexp.
 *
 * @param {Object} obj The target object.
 * @param {Object} pattern The regular expression.
 * @return {number} The founded matched props with regexp count.
 */
export const countPropertiesWithPattern: (
	obj: Object,
	pattern: Object
) => number = (obj: Object, pattern: Object): number => {
	let count = 0;

	for (const key in obj) {
		// $FlowFixMe
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			if (pattern.test(key)) {
				count++;
			}
		}
	}

	return count;
};

/**
 * Generate id for repeater item with state and action params.
 *
 * @param {Object} state The repeater control state.
 * @param {Object} action The action params.
 * @return {string} The generated id for repeater item.
 */
export const generatedDetailsId = (
	state: Object,
	action: Object
): { itemsCount: number, uniqueId: string } => {
	let itemsCount = 0;
	const controlInfo = state[action.controlId];
	const actionValue = action.value || action.item;

	if (!action.id && !actionValue?.type) {
		itemsCount = Object.keys(controlInfo.value).length;

		return {
			itemsCount,
			uniqueId: itemsCount + '',
		};
	}

	if (!state[action.controlId]) {
		return {
			itemsCount,
			uniqueId: `${action.id}-${itemsCount}`,
		};
	}

	itemsCount = countPropertiesWithPattern(
		controlInfo.value,
		new RegExp(`^${action.id || actionValue.type}`, 'i')
	);

	return {
		itemsCount,
		uniqueId: `${action.id || actionValue.type}-${itemsCount}`,
	};
};

export const repeaterOnChange = (
	value: Object,
	{
		ref,
		onChange,
		valueCleanup,
	}: {
		ref?: Object,
		valueCleanup: ((newValue: Object) => Object) | void,
		onChange: (newValue: any, ref: Object | void) => void,
	}
): Object => {
	if ('function' !== typeof onChange) {
		return value;
	}

	if ('function' === typeof valueCleanup) {
		onChange(valueCleanup(value), ref);

		return valueCleanup(value);
	}

	onChange(value, ref);

	return value;
};

export const regeneratedIds = (value: Object, action: Object): Object => {
	const { itemIdGenerator = null } = action;
	const sortedItems = Object.entries({ ...value }).sort(
		([, a], [, b]) => (a.order || 0) - (b.order || 0)
	);

	const newValue: { [key: string]: any } = {};

	sortedItems.forEach(
		memoize(([, item]: [string, any], index: number): void => {
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
		})
	);

	return newValue;
};

export const reOrder = (
	obj: Object,
	uniqueId: string,
	repeaterId: null | string = null
): Object => {
	let reOrdered = {};

	if (repeaterId) {
		const keys = [];
		regexMatch(/[\w-]+/g, repeaterId, (match) => keys.push(match));
		const index = obj[keys[0]][keys[1]][uniqueId].order;

		Object.entries(obj[keys[0]][keys[1]]).forEach(
			memoize(([key, value]) => {
				if (
					(value.order === index && key !== uniqueId) ||
					index < value.order
				) {
					reOrdered = {
						...reOrder,
						...update(obj, repeaterId, {
							[key]: { ...value, order: value.order + 1 },
						}),
					};
				} else {
					reOrdered = {
						...reOrdered,
						...update(obj, repeaterId, {
							[key]: value,
						}),
					};
				}
			})
		);
	} else {
		const index = obj[uniqueId]?.order;

		Object.entries(obj).forEach(
			memoize(([key, value]) => {
				if (
					(value.order === index && key !== uniqueId) ||
					index < value.order
				) {
					reOrdered = {
						...reOrdered,
						[key]: { ...value, order: value.order + 1 },
					};
				} else {
					reOrdered = {
						...reOrdered,
						[key]: value,
					};
				}
			})
		);
	}

	return reOrdered;
};

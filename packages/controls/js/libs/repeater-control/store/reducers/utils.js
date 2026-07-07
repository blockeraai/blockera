// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Blockera dependencies
 */
import { prepare, update } from '@blockera/data-editor';
import { isEquals, isObject, isInteger, isString } from '@blockera/utils';

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
 * use cases: ["add-item", "change-item", "clone-item"]
 *
 * @param {Object} state The repeater control state.
 * @param {Object} action The action params.
 * @return {string} The generated id for repeater item.
 */
export const getNewIdDetails = (
	state: Object,
	action: Object
): { itemsCount: number, uniqueId: string } => {
	let itemsCount = 0;
	const value = action.value;
	const controlInfo = state[action.controlId];

	// Assume recieved value of action has not "type" property!
	if (!value?.type) {
		itemsCount = Object.keys(controlInfo.value).length;

		return {
			itemsCount,
			uniqueId: itemsCount + '',
		};
	}

	// Assume recieved controlId of action has not exists in store state!
	if (!state[action.controlId]) {
		return {
			itemsCount,
			uniqueId: `${value?.type || ''}-${itemsCount}`,
		};
	}

	// Get count number of exists same types in control value.
	itemsCount = countPropertiesWithPattern(
		controlInfo.value,
		new RegExp(`^${value.type}`, 'i')
	);

	return {
		itemsCount,
		uniqueId: `${value.type}-${itemsCount}`,
	};
};

type ResolveAddedRepeaterItemIdArgs = {
	itemValue: ?Object,
	itemsCount: number,
	repeaterItems: Object,
	defaultRepeaterItemValue: Object,
	itemIdGenerator?: (count: number) => string,
	selectableId?: boolean,
};

/**
 * Resolve the repeater item id for a newly added row so it matches pending popover
 * open state and slug-keyed preset values (e.g. global-styles custom presets).
 */
export const resolveAddedRepeaterItemId = ({
	itemValue,
	itemsCount,
	repeaterItems,
	defaultRepeaterItemValue,
	itemIdGenerator,
	selectableId = false,
}: ResolveAddedRepeaterItemIdArgs): string => {
	if ('function' === typeof itemIdGenerator) {
		return itemIdGenerator(itemsCount);
	}

	if (selectableId) {
		const fromValue =
			itemValue &&
			typeof itemValue === 'object' &&
			(itemValue.slug ?? itemValue.type);
		if (
			fromValue !== null &&
			fromValue !== undefined &&
			String(fromValue) !== ''
		) {
			return String(fromValue);
		}

		const fromDefault =
			defaultRepeaterItemValue?.slug ?? defaultRepeaterItemValue?.type;
		if (
			fromDefault !== null &&
			fromDefault !== undefined &&
			String(fromDefault) !== ''
		) {
			return String(fromDefault);
		}

		return String(itemsCount);
	}

	const resolvedItemValue = itemValue || defaultRepeaterItemValue;
	const slug = resolvedItemValue?.slug;

	if (slug !== null && slug !== undefined && String(slug) !== '') {
		return String(slug);
	}

	if (!resolvedItemValue?.type) {
		return String(itemsCount);
	}

	const typeCount = countPropertiesWithPattern(
		repeaterItems || {},
		new RegExp(`^${resolvedItemValue.type}`, 'i')
	);

	return `${resolvedItemValue.type}-${typeCount}`;
};

/**
 * Whether a repeater item should be renamed when its type no longer matches itemId.
 *
 * @param {string} itemId The current repeater item id.
 * @param {Object} value The repeater item value.
 * @param {string|void} staticType Optional fixed id override.
 * @return {boolean} True when rename-by-type should run.
 */
export const shouldRenameRepeaterItemByType = (
	itemId: string,
	value: Object,
	staticType?: string
): boolean => {
	return Boolean(
		value?.type &&
		!new RegExp(`^${value.type}`, 'i').test(itemId) &&
		!staticType
	);
};

/**
 * Rename a repeater item key to match its type value.
 *
 * @param {Object} controlValue The repeater control value.
 * @param {Object} state The repeater store state.
 * @param {Object} action The rename action params.
 * @return {Object|null} The renamed value, unchanged value on duplicate, or null when skipped.
 */
export const renameRepeaterItemByTypeValue = (
	controlValue: Object,
	state: Object,
	action: Object
): ?Object => {
	if (
		!shouldRenameRepeaterItemByType(
			action.itemId,
			action.value,
			action.staticType
		)
	) {
		return null;
	}

	const clonedPrevValue = { ...controlValue };

	delete clonedPrevValue[action.itemId];

	let { uniqueId } = getNewIdDetails(state, action);

	if ('function' === typeof action.getId) {
		uniqueId = action.getId();
	}

	if (
		clonedPrevValue[uniqueId] &&
		isEquals(action.value, clonedPrevValue[uniqueId])
	) {
		return controlValue;
	}

	return regeneratedIds(
		{
			...clonedPrevValue,
			[uniqueId]: action.value,
		},
		action
	);
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
	value = 'function' === typeof valueCleanup ? valueCleanup(value) : value;

	if ('function' !== typeof onChange) {
		return value;
	}

	onChange(value, ref);

	return value;
};

export const regeneratedIds = (value: Object, action: Object): Object => {
	const { itemIdGenerator = null } = action;
	const sortedItems = Object.entries({ ...value }).sort(
		memoize(([, a], [, b]) => {
			const result = (a.order || 0) - (b.order || 0);

			if (result < 0) {
				return -1;
			} else if (result > 0) {
				return 1;
			}

			return 0;
		})
	);

	const newValue: { [key: string]: any } = {};

	sortedItems.forEach(
		memoize(([, item]: [string, any], index: number): void => {
			item.order = index;

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
		const index = prepare(repeaterId + `[${uniqueId}].order`, obj);

		Object.entries(prepare(repeaterId, obj)).forEach(
			memoize(([key, value]) => {
				if (Number(key)) {
					key = Number(key);
				}

				if (
					(value.order === index && key !== uniqueId) ||
					index < value.order
				) {
					reOrdered = {
						...reOrder,
						...update(obj, repeaterId, {
							// $FlowFixMe
							[key]: { ...value, order: value?.order + 1 },
						}),
					};
				} else {
					reOrdered = {
						...reOrdered,
						...update(obj, repeaterId, {
							// $FlowFixMe
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

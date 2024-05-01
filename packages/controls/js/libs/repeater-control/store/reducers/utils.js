// @flow

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

// @flow

/**
 * Blockera dependencies
 */
import { isEmpty, isObject, truthy } from '@blockera/utils';

/**
 * Retrieve normalized select control options.
 *
 * @param {Array<Object>} options the select control props.
 * @return {Array<{label: *, value: *}>} the normalized select control options array.
 */
export const normalizedSelectOptions = (
	options: Array<Object>
): Array<Object> => {
	if (!isObject(options)) {
		return options;
	}

	return Object.entries(options)
		.map(([value, label]) => ({
			label,
			value,
		}))
		.filter((i) => null !== i);
};

/**
 * Is enable renderer control status?
 *
 * @param {Array<string>} conditions the conditions array.
 * @param {Object} value the parent control context provider value.
 * @return {boolean} true on success, false on otherwise!
 */
export const isEnableRenderer = (
	conditions: Array<string>,
	value: Object
): boolean => {
	// Assume nothing exists any condition, accordingly return value truthy.
	if (isEmpty(conditions)) {
		return true;
	}

	const results = conditions.map((condition: string): boolean =>
		truthy(condition, value)
	);

	return results.filter((result: boolean) => false !== result).length > 0;
};

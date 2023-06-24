import { isObject, isArray } from '@publisher/utils';

/**
 * Return a new object with the specified keys omitted.
 *
 * @param {Object} object Original object.
 * @param {Array}  keys   Keys to be omitted.
 *
 * @return {Object} Object with omitted keys.
 */
export function omit(object, keys) {
	return Object.fromEntries(
		Object.entries(object).filter(([key]) => !keys.includes(key))
	);
}

/**
 * is block extension?
 *
 * @param {string} type the block extension string must be equal with "block"
 * @return {boolean} true on success, false when otherwise!
 */
export const isBlockTypeExtension = ({ type }) => 'block' === type;

/**
 * is active extension?
 *
 * @param {string} fieldConfig the field config
 * @return {boolean} true on success, false when otherwise!
 */
export const isActiveField = (fieldConfig) =>
	isObject(fieldConfig) ? fieldConfig?.status : true === fieldConfig;

/**
 * is enable extension?
 *
 * @param {Object} extension the target extension
 * @return {boolean} true on success, false on otherwise
 */
export const isEnableExtension = (extension) => true === extension?.status;

/**
 * Merging objects
 *
 * @param {Object} a the object first
 * @param {Object} b the object second
 * @return {Object} merged second object into first
 */
export const merge = (a: Object, b: Object): Object => {
	for (const key in b) {
		if (!Object.hasOwnProperty.call(b, key)) {
			continue;
		}

		const element = b[key];

		if (!element) {
			continue;
		}

		if (isObject(element)) {
			a = {
				...a,
				key: {
					...(a[key] || {}),
					...element,
				},
			};

			continue;
		}

		if (isArray(element)) {
			a = {
				...a,
				key: [...(a[key] || []), ...element],
			};

			continue;
		}

		a = {
			...a,
			[!a[key] ? key : a[key]]: b[key],
		};
	}

	return a;
};

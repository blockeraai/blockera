// @flow

/**
 * Internal dependencies
 */
import { getCamelCase } from '../string';
import { isArray, isObject } from '../is';

/**
 * Return a new object with the specified keys omitted.
 *
 * @param {Object} object Original object.
 * @param {Array}  keys   Keys to be omitted.
 *
 * @return {Object} Object with omitted keys.
 */
export function omit(object: Object, keys: Array<string>): Object {
	return Object.fromEntries(
		Object.entries(object).filter(([key]) => !keys.includes(key))
	);
}

export function omitWithPattern(object: Object, pattern: string): Object {
	return Object.fromEntries(
		Object.entries(object).filter(([key]) => !pattern.test(key))
	);
}

/**
 * Return a new object with the specified keys included.
 *
 * @param {Object} object Original object.
 * @param {Array}  keys   Keys to be included.
 *
 * @param {string} deletePrefixSuffix
 * @return {Object} Object with included keys.
 */
export function include(
	object: Object,
	keys: Array<string>,
	deletePrefixSuffix: string = ''
): Object {
	return Object.fromEntries(
		Object.entries(object)
			.filter(([key]) => keys.includes(key))
			.map((item) => [getCamelCase(item[0], deletePrefixSuffix), item[1]])
	);
}

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

// @flow

/**
 * Internal dependencies
 */
import { getCamelCase } from '../string';

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

export function omitWithPattern(object: Object, pattern: Object): Object {
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
 * Delete recieved path of main object.
 *
 * @param {Object} obj the main object.
 * @param {string} path the delete property path.
 */
export const deletePropertyByPath = (obj: Object, path: string): Object => {
	const keys = path.split('.');
	let current = obj;

	for (let i = 0; i < keys.length - 1; i++) {
		let key = keys[i];

		if (/\d+/.test(key)) {
			key = Number(key);
			// console.log(key);
		}

		if (!current[key]) {
			return; // Property doesn't exist, nothing to delete
		}

		current = current[key];
	}

	let key = keys[keys.length - 1];

	if (/\d+/.test(key)) {
		key = Number(key);
	}

	delete current[key];

	return obj;
};

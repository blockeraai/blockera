// @flow

/**
 * External dependencies
 */
import { copy } from 'fastest-json-copy';

/**
 * Internal dependencies
 */
import { getCamelCase } from '../string';
import { isObject } from '../is';

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
 * Delete received path of main object.
 *
 * @param {Object} obj the main object.
 * @param {string} path the delete property path.
 */
export const deletePropertyByPath = (obj: Object, path: string): Object => {
	const keys = path.split('.');
	let current = obj;

	for (let i = 0; i < keys.length - 1; i++) {
		let key: string | number = keys[i];

		if ('string' === typeof key && /\d+/.test(key)) {
			key = Number(key);
		}

		if (!current[key]) {
			return; // Property doesn't exist, nothing to delete
		}

		current = current[key];
	}

	let key: string | number = keys[keys.length - 1];

	if ('string' === typeof key && /\d+/.test(key)) {
		key = Number(key);
	}

	delete current[key];

	return obj;
};

/**
 * Deep merge two objects.
 *
 * @param {Object} target the target object.
 * @param {Object} source the new source to merge with target object.
 * @param {Object} args the extra arguments to merge process.
 */
export function mergeObject(
	target: Object,
	source: Object,
	args: {
		forceUpdated: Array<string>,
		deletedProps: Array<string>,
	}
): Object {
	if (!isObject(source)) {
		return target;
	}

	const { forceUpdated = [], deletedProps = [] } = args || {};

	const result = { ...target }; // Create a clone of the target object

	Object.keys(source).forEach((key) => {
		if (
			forceUpdated.includes(key) &&
			source[key] &&
			isObject(source[key])
		) {
			result[key] = source[key];
		} else if (isObject(source[key])) {
			if (!result[key] || !isObject(result[key])) result[key] = {};
			result[key] = mergeObject(result[key], source[key], args); // Merge recursively
		} else {
			if (undefined === source[key] && deletedProps.includes(key)) {
				delete result[key];

				return;
			}

			result[key] = source[key];
		}
	});

	return result;
}

/**
 * Deep merge multiple objects
 *
 * @param {Object} target
 * @param {Object} sources
 */
export function mergeObjects(
	target: Object,
	...sources: Array<Object>
): Object {
	if (!isObject(target)) {
		return target;
	}

	const result = { ...target }; // Create a clone of the target object

	sources.forEach((_source) => {
		if (isObject(_source)) {
			Object.keys(_source).forEach((key) => {
				if (isObject(_source[key])) {
					if (!result[key] || !isObject(result[key]))
						result[key] = {};
					result[key] = mergeObjects(result[key], _source[key]); // Merge recursively
				} else {
					result[key] = _source[key];
				}
			});
		}
	});

	return result;
}

/**
 * Has objected some passed properties?
 *
 * @param {Object} obj the any object
 * @param {Array<string>} props the props of any object
 * @return {boolean} true on success, false when otherwise!
 */
export function hasInvolvesSomeItems(
	obj: Object,
	props: Array<string>
): boolean {
	const statuses: { [key: string]: boolean } = {};

	for (let i = 0; i < props.length; i++) {
		if (!obj.hasOwnProperty(props[i])) {
			statuses[props[i]] = false;

			continue;
		}

		statuses[props[i]] = true;
	}

	return Object.values(statuses).includes(true);
}

/**
 * Create a deep copy of an object.
 *
 * This function use the `fastest-json-copy` that is fastest way to clone objects.
 * source: https://github.com/streamich/fastest-json-copy
 *
 * @param {Object} obj
 * @return {Object} the cloned object
 */
export function cloneObject(obj: Object): Object {
	return copy(obj);
}

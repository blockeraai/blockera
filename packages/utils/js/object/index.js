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

// Dot-path segments such as "0" or "1" must be coerced to numbers for array access.
const NUMERIC_KEY_PATTERN = /\d+/;

/**
 * Resolve a path segment to an object access key.
 *
 * @param {string} key Path segment from a dot-separated property path.
 * @return {string | number} Numeric segment as number, otherwise the original key.
 */
const toAccessKey = (key: string): string | number => {
	if (NUMERIC_KEY_PATTERN.test(key)) {
		return Number(key);
	}

	return key;
};

/**
 * Return a new object with the specified keys omitted.
 *
 * @param {Object} object Original object.
 * @param {Array}  keys   Keys to be omitted.
 *
 * @return {Object} Object with omitted keys.
 */
export function omit(object: Object, keys: Array<string>): Object {
	if (!keys.length) {
		return copy(object);
	}

	const keysSet = new Set(keys);
	const clonedObject = copy(object);
	const result: { [key: string]: any } = {};

	for (const key in clonedObject) {
		if (clonedObject.hasOwnProperty(key) && !keysSet.has(key)) {
			result[key] = clonedObject[key];
		}
	}

	return result;
}

/**
 * Return a new object with the specified keys omitted by pattern.
 *
 * @param {Object} object Original object.
 * @param {Object} pattern Pattern to be omitted.
 *
 * @return {Object} Object with omitted keys.
 */
export function omitWithPattern(object: Object, pattern: Object): Object {
	const result: { [key: string]: any } = {};

	for (const key in object) {
		if (object.hasOwnProperty(key) && !pattern.test(key)) {
			result[key] = object[key];
		}
	}

	return result;
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
	if (!keys.length) {
		return {};
	}

	const keysSet = new Set(keys);
	const clonedObject = copy(object);
	const result: { [key: string]: any } = {};

	for (const key in clonedObject) {
		if (clonedObject.hasOwnProperty(key) && keysSet.has(key)) {
			result[getCamelCase(key, deletePrefixSuffix)] = clonedObject[key];
		}
	}

	return result;
}

/**
 * Delete received path of main object.
 *
 * @param {Object} obj the main object.
 * @param {string} path the delete property path.
 */
export const deletePropertyByPath = (obj: Object, path: string): Object => {
	const keys = path.split('.');
	const lastIndex = keys.length - 1;
	let current = obj;

	for (let i = 0; i < lastIndex; i++) {
		const key = toAccessKey(keys[i]);

		if (!current[key]) {
			return; // Property doesn't exist, nothing to delete
		}

		current = current[key];
	}

	delete current[toAccessKey(keys[lastIndex])];

	return obj;
};

/**
 * Internal recursive merge. `forceUpdated` keys are shallow-replaced instead of
 * deep-merged; `deletedProps` keys are removed when the source value is undefined.
 *
 * @param {Object} target the target object.
 * @param {Object} source the new source to merge with target object.
 * @param {Set<string>} forceUpdatedSet the keys to force update.
 * @param {Set<string>} deletedPropsSet the keys to delete when undefined.
 */
function mergeObjectDeep(
	target: Object,
	source: Object,
	forceUpdatedSet: Set<string>,
	deletedPropsSet: Set<string>
): Object {
	if (!isObject(source)) {
		return { ...target };
	}

	const result = { ...target };

	for (const key in source) {
		if (!source.hasOwnProperty(key)) {
			continue;
		}

		if (forceUpdatedSet.has(key) && source[key] && isObject(source[key])) {
			result[key] = { ...source[key] }; // Clone to prevent reference mutation
		} else if (isObject(source[key])) {
			if (!result[key] || !isObject(result[key])) {
				result[key] = {};
			}
			result[key] = mergeObjectDeep(
				result[key],
				source[key],
				forceUpdatedSet,
				deletedPropsSet
			);
		} else if (undefined === source[key] && deletedPropsSet.has(key)) {
			delete result[key];
		} else {
			result[key] = source[key];
		}
	}

	return result;
}

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
	const { forceUpdated = [], deletedProps = [] } = args || {};

	return mergeObjectDeep(
		target,
		source,
		new Set(forceUpdated),
		new Set(deletedProps)
	);
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

	const result = { ...target };

	for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
		const _source = sources[sourceIndex];

		if (!isObject(_source)) {
			continue;
		}

		for (const key in _source) {
			if (!_source.hasOwnProperty(key)) {
				continue;
			}

			if (isObject(_source[key])) {
				if (!result[key] || !isObject(result[key])) {
					result[key] = {};
				}
				result[key] = mergeObjects(result[key], _source[key]);
			} else {
				result[key] = _source[key];
			}
		}
	}

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
	for (let i = 0; i < props.length; i++) {
		if (obj.hasOwnProperty(props[i])) {
			return true;
		}
	}

	return false;
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

/**
 * Resolve the priority value used for sorting.
 * Walks `paths` (e.g. `['settings']`) then reads `.priority` on the resolved node.
 *
 * @param {Object} value Object entry value to read priority from.
 * @param {Array<string>} paths Nested keys leading to the priority field.
 * @param {number} fallbackPriority Priority used when the resolved value is missing or zero.
 * @return {number} Resolved priority for sort comparison.
 */
const getSortPriority = (
	value: Object,
	paths: Array<string>,
	fallbackPriority: number
): number => {
	let current = value;

	for (let index = 0; index < paths.length; index++) {
		current = current?.[paths[index]];
	}

	// Use `||` so explicit `0` falls back — matches legacy sort behavior.
	return current?.priority || fallbackPriority;
};

/**
 * Sort an object by priority.
 *
 * @param {Object} obj the object to sort.
 * @param {string} priorityPath the priority property path of object to use for sorting process.
 * @param {number} fallbackPriority the fallback value for each items has not priority property.
 *
 * @return {Object} the sorted object.
 */
export const getSortedObject = (
	obj: Object,
	priorityPath: string,
	fallbackPriority: number = 0
): Object => {
	const paths = priorityPath ? priorityPath.split('.') : [];
	const entries = Object.entries(obj);

	if (!entries.length) {
		return {};
	}

	// Precompute priorities once — avoids re-walking nested paths on every sort comparison.
	const sortedEntries = entries
		.map((entry) => ({
			entry,
			priority: getSortPriority(entry[1], paths, fallbackPriority),
		}))
		.sort((a, b) => a.priority - b.priority)
		.map(({ entry }) => entry);

	return Object.fromEntries(sortedEntries);
};

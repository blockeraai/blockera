// @flow
/**
 * Publisher dependencies
 */
import { isArray, isObject, isString } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { regexMatch } from '../utils';

/**
 * Update object
 *
 * @param {Object} object the target object
 * @param {string} query the query of object props
 * @param {any} value the new value of object query
 * @param {string} type the type of update process
 */
export function update(
	object: Object,
	query: string,
	value: any,
	type: string = 'replace'
): null {
	const keys = [];
	let currentObj = object;

	regexMatch(/[\w-]+/g, query, (match) => keys.push(match));

	const lastKey = keys.pop();

	for (const key of keys) {
		currentObj = currentObj[key];
	}

	if ('mute' === type) {
		currentObj[lastKey] = value;

		return isObject(object) ? { ...object } : [...object];
	}

	switch (true) {
		case isObject(currentObj[lastKey]):
			if (isObject(value)) {
				currentObj[lastKey] = {
					...currentObj[lastKey],
					...value,
				};
			} else {
				currentObj[lastKey] = {
					...currentObj[lastKey],
					value,
				};
			}

			return isObject(object) ? { ...object } : [...object];

		case isArray(currentObj[lastKey]):
			if (isArray(value)) {
				currentObj[lastKey] = [...currentObj[lastKey], ...value];
			} else {
				currentObj[lastKey].push(value);
			}

			return isObject(object) ? { ...object } : [...object];

		case isString(currentObj[lastKey]):
		default:
			currentObj[lastKey] = value;

			return isObject(object) ? { ...object } : [...object];
	}
}

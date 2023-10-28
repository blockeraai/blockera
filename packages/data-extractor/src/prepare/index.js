/**
 * Publisher dependencies
 */
import { isEmpty, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { regexMatch } from '../utils';

/**
 * Prepare query of dataset value
 *
 * @param {string} query the query of object props
 * @param {Object} dataset the origin object
 * @return {*} value of dataset queried props
 */
export function prepare(query: string, dataset: Object): Array<string> {
	const parsedQuery = query.split('.');
	const itemValue = (...values) => values.reduce(accumulator, dataset);

	let props = [];

	parsedQuery.forEach((item, index) => {
		//TODO: refactor this block!
		if (0 === item.indexOf('[')) {
			regexMatch(/\[(.*?)]/g, item, (match, groupIndex) => {
				if (0 === groupIndex) {
					return;
				}

				props.push(match);
			});

			return;
		}

		props = toArray(item, props, index);
	});

	return itemValue(...props);
}

/**
 * Accumulate items of prepare reducer
 *
 * @param {Object} a the accumulate
 * @param {string} x the item of reducer
 * @return {*} return any value
 */
export function accumulator(a, x) {
	const aIsInValid = isUndefined(a) || isEmpty(a);
	const xIsInValid = isUndefined(x) || isEmpty(x);

	if (aIsInValid || xIsInValid) {
		return undefined;
	}

	return a[x];
}

/**
 * Push to array
 *
 * @param {string} item the propId or index of array
 * @param {Array<any>} arr the array target
 * @return {Array<*>} return array
 */
export function toArray(item: string, arr: Array<any>): Array<any> {
	const search = /[\[\]]/g;

	if (-1 !== item.indexOf('[')) {
		const details = item.split('[');

		details.forEach((_item) => {
			arr.push(_item.replace(search, ''));
		});

		return arr;
	}

	const newItem = item.replace(search, '');

	if (!isEmpty(newItem)) {
		arr.push(newItem);
	}

	return arr;
}

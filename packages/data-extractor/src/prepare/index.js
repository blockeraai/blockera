// @flow

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
export function prepare(query: string, dataset: Object): any {
	if (isUndefined(query) || isEmpty(query)) {
		return undefined;
	}

	const parsedQuery = query.split('.');
	const itemValue = (...values: Array<string>) =>
		values.reduce(accumulator, dataset);

	return itemValue(...getPropPath([], parsedQuery));
}

export function getPropPath(
	props: Array<string>,
	parsedQuery: Array<string>
): Array<string> {
	parsedQuery.forEach((item: any): void => {
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

		props = toArray(item, props);
	});

	return props;
}

/**
 * Accumulate items of prepare reducer
 *
 * @param {Object} a the accumulate
 * @param {string} x the item of reducer
 * @return {*} return any value
 */
export function accumulator(a: Object, x: string): any {
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

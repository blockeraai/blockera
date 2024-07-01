// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Internal dependencies
 */
import { isUndefined, isObject, isArray } from '../is';

export const arraySortItems = ({
	args,
	toIndex,
	fromIndex,
}: Object): Array<any> => {
	if (fromIndex === toIndex) return args;

	const newArr = args.slice();
	const item = newArr[fromIndex];

	if (fromIndex < toIndex) {
		for (let i = fromIndex; i < toIndex; i++) {
			newArr[i] = newArr[i + 1];
		}
	} else {
		for (let i = fromIndex; i > toIndex; i--) {
			newArr[i] = newArr[i - 1];
		}
	}

	newArr[toIndex] = item;

	return newArr;
};

export const toObject = (arr: Array<any>): Object => {
	return arr.reduce((acc, cur) => Object.assign(acc, cur), {});
};

const memoizedIsEquals: (a: any, b: any) => boolean = memoize(
	(a: any, b: any): boolean => {
		if (a === b) {
			return true;
		}

		if (isUndefined(a) || isUndefined(b)) {
			return false;
		}

		if (isArray(a) && isArray(a)) {
			if (a === b) {
				return true;
			}

			if (a.length !== b.length) {
				return false;
			}

			for (let i = 0; i < a.length; i++) {
				if (Array.isArray(a[i]) && Array.isArray(b[i])) {
					if (!isEquals(a[i], b[i])) {
						return false;
					}
				} else if (!isEquals(a[i], b[i])) {
					return false;
				}
			}

			return true;
		}

		if (isObject(a) && isObject(a)) {
			if (a === b) {
				return true;
			}

			const keys1 = Object.keys(a);
			const keys2 = Object.keys(b);

			if (keys1.length !== keys2.length) {
				return false;
			}

			for (const key of keys1) {
				const val1 = a[key];
				const val2 = b[key];

				const areObjects = isObject(val1) && isObject(val2);

				if (
					(areObjects && !isEquals(val1, val2)) ||
					(!areObjects && !isEquals(val1, val2))
				) {
					return false;
				}
			}

			return true;
		}

		return JSON.stringify(a) === JSON.stringify(b);
	}
);

export const isEquals = memoizedIsEquals;

export const indexOf = (arr: Array<any>, q: string): number => {
	if (isUndefined(arr)) {
		return -1;
	}

	return arr.findIndex((item) => q.toLowerCase() === item.toLowerCase());
};

export const arrayDiff = (arr1: Array<any>, arr2: Array<any>): Array<any> => {
	return arr1.filter((element) => !arr2.includes(element));
};

/**
 * Get differences between recieved arrays.
 *
 * @param {Array<any>} array the target array.
 * @param {Array<Array<any>>} values the other arrays.
 * @return {*[]} the difference array.
 */
export const difference = (
	array: Array<any>,
	...values: Array<Array<any>>
): Array<any> => {
	const set = new Set(values.flat());

	return array.filter((item) => !set.has(item));
};

/**
 * Get array unique items.
 *
 * @param {Array<any>} array the target array.
 * @param {Array<Array<any>>} values the other arrays.
 *
 * @return {*[]} the array with unique items.
 */
export const union = (
	array: Array<any>,
	...values: Array<Array<any>>
): Array<any> => {
	const set = new Set(values.flat());

	return [...new Set([...array, ...set])];
};

/**
 * Get result array without recieved values to remove of target.
 *
 * @param {Array<any>} array the target array.
 * @param {Array<Array<any>>} valuesToRemove the values arrays to remove.
 * @return {Array<any>} the array without valuesToRemove.
 */
export const without = (
	array: Array<any>,
	...valuesToRemove: Array<Array<any>>
): Array<any> => {
	return array.filter((item) => !valuesToRemove.flat().includes(item));
};

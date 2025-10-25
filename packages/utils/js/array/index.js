// @flow

/**
 * External dependencies
 */
import equal from 'fast-deep-equal';

/**
 * Internal dependencies
 */
import { isUndefined } from '../is';

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

export const isEquals: (a: any, b: any) => boolean = (
	a: any,
	b: any
): boolean => {
	return equal(a, b);
};

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

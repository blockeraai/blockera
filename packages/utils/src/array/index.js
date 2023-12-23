// @flow
/**
 * Internal dependencies
 */
import { isUndefined, isObject, isArray } from '../is';

export const arraySortItems = ({
	args,
	toIndex,
	fromIndex,
}: Object): Array<any> => {
	const newArr = [...args];
	const [removed] = newArr.splice(fromIndex, 1);
	newArr.splice(toIndex, 0, removed);

	return newArr;
};

export const toObject = (arr: Array<any>): Object => {
	return arr.reduce((acc, cur) => Object.assign(acc, cur), {});
};

export const isEquals = (
	a: Array<any> | Object,
	b: Array<any> | Object
): boolean => {
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
				(!areObjects && val1 !== val2)
			) {
				return false;
			}
		}

		return true;
	}

	return JSON.stringify(a) === JSON.stringify(b);
};

export const indexOf = (arr: Array<any>, q: string): number => {
	if (isUndefined(arr)) {
		return -1;
	}

	return arr.findIndex((item) => q.toLowerCase() === item.toLowerCase());
};

// @flow
/**
 * Internal dependencies
 */
import { isUndefined } from '../is';

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

export const isEquals = (arr1: Array<any>, arr2: Array<any>): boolean => {
	return JSON.stringify(arr1) === JSON.stringify(arr2);
};

export const indexOf = (arr: Array<any>, q: string): number => {
	if (isUndefined(arr)) {
		return -1;
	}

	return arr.findIndex((item) => q.toLowerCase() === item.toLowerCase());
};

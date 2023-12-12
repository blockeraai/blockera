// @flow

export const checkVisibleItemLength = (array: Array<Object>): number => {
	if (!array.length) return 0;
	return array.filter((item) => item.isVisible).length;
};

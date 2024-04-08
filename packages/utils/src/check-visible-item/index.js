// @flow

export const checkVisibleItemLength = (items: Object): number => {
	let length = 0;

	Object.entries(items)?.map(([, item]) => {
		if (!item.isVisible) {
			return null;
		}

		length++;

		return null;
	});

	return length;
};

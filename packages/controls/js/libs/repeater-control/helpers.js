// @flow

export function getRepeaterActiveItemsCount(items: Object): number {
	let activeItemsCount = 0;

	Object.entries(items).forEach(([, item]) => {
		if (!item.isVisible) {
			return;
		}

		++activeItemsCount;
	});

	return activeItemsCount;
}

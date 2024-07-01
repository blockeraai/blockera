// @flow

export function getRepeaterActiveItemsCount(items: Object): number {
	let activeItemsCount = 0;

	for (const key in items) {
		if (items[key]?.isVisible) {
			activeItemsCount++;
		}
	}

	return activeItemsCount;
}

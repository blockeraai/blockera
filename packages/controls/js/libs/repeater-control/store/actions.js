export function addRepeaterItem({
	value,
	controlId,
	itemIdGenerator,
	maxItems = -1,
	repeaterId = null,
}) {
	return {
		value,
		maxItems,
		controlId,
		repeaterId,
		itemIdGenerator,
		type: 'ADD_REPEATER_ITEM',
	};
}

export function changeRepeaterItem({
	value,
	getId,
	itemId,
	controlId,
	defaultItemValue,
	maxItems = -1,
	repeaterId = null,
}) {
	return {
		value,
		getId,
		itemId,
		controlId,
		maxItems,
		repeaterId,
		type: 'CHANGE_REPEATER_ITEM',
		defaultItemValue: defaultItemValue ?? {},
	};
}

export function removeRepeaterItem({
	itemId,
	controlId,
	itemIdGenerator,
	repeaterId = null,
}) {
	return {
		itemId,
		controlId,
		repeaterId,
		itemIdGenerator,
		type: 'REMOVE_REPEATER_ITEM',
	};
}

export function sortRepeaterItem({
	items,
	toIndex,
	controlId,
	fromIndex,
	repeaterId = null,
}) {
	return {
		items,
		toIndex,
		fromIndex,
		controlId,
		repeaterId,
		type: 'SORT_REPEATER_ITEM',
	};
}

export function cloneRepeaterItem({
	item,
	itemId,
	controlId,
	itemIdGenerator,
	maxItems = -1,
	repeaterId = null,
	overrideItem = null,
}) {
	return {
		item,
		itemId,
		controlId,
		maxItems,
		repeaterId,
		overrideItem,
		itemIdGenerator,
		type: 'CLONE_REPEATER_ITEM',
	};
}

export * from '../../../store/actions';

export function addRepeaterItem({
	value,
	controlId,
	maxItems = -1,
	repeaterId = null,
}) {
	return {
		value,
		maxItems,
		controlId,
		repeaterId,
		type: 'ADD_REPEATER_ITEM',
	};
}

export function changeRepeaterItem({
	value,
	itemId,
	controlId,
	defaultItemValue,
	maxItems = -1,
	repeaterId = null,
	valueCleanup = null,
}) {
	return {
		value,
		itemId,
		controlId,
		maxItems,
		repeaterId,
		valueCleanup,
		type: 'CHANGE_REPEATER_ITEM',
		defaultItemValue: defaultItemValue ?? {},
	};
}

export function removeRepeaterItem({ controlId, itemId, repeaterId = null }) {
	return {
		itemId,
		controlId,
		repeaterId,
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
	itemId,
	controlId,
	maxItems = -1,
	repeaterId = null,
}) {
	return {
		itemId,
		controlId,
		maxItems,
		repeaterId,
		type: 'CLONE_REPEATER_ITEM',
	};
}

export * from '../../../store/actions';

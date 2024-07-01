export function addRepeaterItem({
	value,
	onChange,
	controlId,
	valueCleanup,
	itemIdGenerator,
	maxItems = -1,
	repeaterId = null,
}) {
	return {
		value,
		maxItems,
		onChange,
		controlId,
		repeaterId,
		valueCleanup,
		itemIdGenerator,
		type: 'ADD_REPEATER_ITEM',
	};
}

export function changeRepeaterItem({
	ref,
	value,
	getId,
	itemId,
	controlId,
	onChange,
	valueCleanup,
	maxItems = -1,
	defaultItemValue,
	repeaterId = null,
}) {
	return {
		ref,
		value,
		getId,
		itemId,
		maxItems,
		onChange,
		controlId,
		repeaterId,
		valueCleanup,
		type: 'CHANGE_REPEATER_ITEM',
		defaultItemValue: defaultItemValue ?? {},
	};
}

export function removeRepeaterItem({
	itemId,
	onChange,
	controlId,
	valueCleanup,
	itemIdGenerator,
	repeaterId = null,
}) {
	return {
		itemId,
		onChange,
		controlId,
		repeaterId,
		valueCleanup,
		itemIdGenerator,
		type: 'REMOVE_REPEATER_ITEM',
	};
}

export function sortRepeaterItem({
	items,
	toIndex,
	onChange,
	controlId,
	fromIndex,
	valueCleanup,
	repeaterId = null,
}) {
	return {
		items,
		toIndex,
		onChange,
		fromIndex,
		controlId,
		repeaterId,
		valueCleanup,
		type: 'SORT_REPEATER_ITEM',
	};
}

export function cloneRepeaterItem({
	value,
	itemId,
	onChange,
	controlId,
	valueCleanup,
	itemIdGenerator,
	maxItems = -1,
	repeaterId = null,
	overrideItem = null,
}) {
	return {
		value,
		itemId,
		onChange,
		maxItems,
		controlId,
		repeaterId,
		valueCleanup,
		overrideItem,
		itemIdGenerator,
		type: 'CLONE_REPEATER_ITEM',
	};
}

export * from '../../../store/actions';

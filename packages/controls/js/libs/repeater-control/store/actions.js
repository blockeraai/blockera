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

export function renameRepeaterItemByType({
	ref,
	value,
	getId,
	itemId,
	controlId,
	onChange,
	staticType,
	valueCleanup,
	repeaterId = null,
}) {
	return {
		ref,
		value,
		getId,
		itemId,
		onChange,
		controlId,
		staticType,
		repeaterId,
		valueCleanup,
		type: 'RENAME_REPEATER_ITEM_BY_TYPE',
	};
}

export function changeRepeaterItem({
	ref,
	value,
	getId,
	itemId,
	controlId,
	onChange,
	staticType,
	valueCleanup,
	maxItems = -1,
	defaultItemValue,
	repeaterId = null,
	disableRegenerateId = true,
}) {
	return {
		ref,
		value,
		getId,
		itemId,
		maxItems,
		onChange,
		controlId,
		staticType,
		repeaterId,
		valueCleanup,
		disableRegenerateId,
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
	disableRegenerateId = true,
}) {
	return {
		itemId,
		onChange,
		controlId,
		repeaterId,
		valueCleanup,
		itemIdGenerator,
		disableRegenerateId,
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

export function resetRepeaterItem({
	itemId,
	defaultValue,
	onChange,
	controlId,
	valueCleanup,
	repeaterId = null,
}) {
	return {
		itemId,
		defaultValue: defaultValue ?? {},
		onChange,
		controlId,
		repeaterId,
		valueCleanup,
		type: 'RESET_REPEATER_ITEM',
	};
}

export * from '../../../store/actions';

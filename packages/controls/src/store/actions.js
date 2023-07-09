export const addControl = (control) => ({
	type: 'ADD_UNPROCESSED_CONTROL',
	control,
});

export const removeControl = (names) => ({
	names,
	type: 'REMOVE_CONTROL',
});

export function modifyControlValue({
	value,
	propId,
	controlId,
	valueCleanup = null,
}) {
	return {
		value,
		propId,
		controlId,
		valueCleanup,
		type: 'MODIFY_CONTROL_VALUE',
	};
}

export function addRepeaterItem({
	value,
	controlId,
	maxItems = -1,
	repeaterId = null,
	repeaterParentItemId = null,
}) {
	return {
		value,
		maxItems,
		controlId,
		repeaterId,
		repeaterParentItemId,
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
	repeaterParentItemId = null,
}) {
	return {
		value,
		itemId,
		controlId,
		maxItems,
		repeaterId,
		valueCleanup,
		repeaterParentItemId,
		type: 'CHANGE_REPEATER_ITEM',
		defaultItemValue: defaultItemValue ?? {},
	};
}

export function removeRepeaterItem({
	controlId,
	itemId,
	repeaterId = null,
	repeaterParentItemId = null,
}) {
	return {
		itemId,
		controlId,
		repeaterId,
		repeaterParentItemId,
		type: 'REMOVE_REPEATER_ITEM',
	};
}

export function sortRepeaterItem({
	items,
	toIndex,
	controlId,
	fromIndex,
	repeaterId = null,
	repeaterParentItemId = null,
}) {
	return {
		items,
		toIndex,
		fromIndex,
		controlId,
		repeaterId,
		repeaterParentItemId,
		type: 'SORT_REPEATER_ITEM',
	};
}

export function cloneRepeaterItem({
	itemId,
	controlId,
	maxItems = -1,
	repeaterId = null,
	repeaterParentItemId = null,
}) {
	return {
		itemId,
		controlId,
		maxItems,
		repeaterId,
		repeaterParentItemId,
		type: 'CLONE_REPEATER_ITEM',
	};
}

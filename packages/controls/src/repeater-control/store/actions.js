export const addRepeaterItem = (item) => ({
	type: 'ADD_REPEATER_ITEM',
	payload: item,
});

export const removeRepeaterItem = (id) => ({
	type: 'REMOVE_REPEATER_ITEM',
	payload: id,
});

export const changeRepeaterItem = (id, item) => ({
	type: 'MODIFY_REPEATER_ITEM',
	payload: {
		id,
		item,
	},
});

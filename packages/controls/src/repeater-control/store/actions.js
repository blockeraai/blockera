export const addItem = (item) => ({
	type: 'ADD',
	payload: item,
});

export const removeItem = (id) => ({
	type: 'REMOVE',
	payload: id,
});

export const changeItem = (id, item) => ({
	type: 'MODIFY',
	payload: {
		id,
		item,
	},
});

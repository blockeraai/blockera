export default function repeaterItemsReducer(draft, action) {
	switch (action.type) {
		case 'ADD_REPEATER_ITEM':
			draft.push(action.payload);
			break;

		case 'REMOVE_REPEATER_ITEM':
			return draft.filter((i, index) => index !== action.payload);

		case 'MODIFY_REPEATER_ITEM':
			const index = draft.findIndex((i, id) => id === action.payload.id);
			draft[index] = action.payload.item;
			break;
	}
}

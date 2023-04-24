export default function repeaterItemsReducer(draft, action) {
	switch (action.type) {
		case 'ADD':
			draft.push(action.payload);
			break;

		case 'REMOVE':
			return draft.filter((i, index) => index !== action.payload);

		case 'MODIFY':
			const index = draft.findIndex((i, id) => id === action.payload.id);
			draft[index] = action.payload.item;
			break;
	}
}

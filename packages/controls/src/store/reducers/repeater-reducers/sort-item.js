/**
 * Publisher dependencies
 */
import { isActionFromChildRepeater } from './utils';
import { arraySortItems } from '@publisher/utils';

export function sortItem(state = {}, action) {
	// state manager with arrived action from child dispatcher!
	if (isActionFromChildRepeater(action)) {
		return {
			...state,
			[action.controlId]: {
				...state[action.controlId],
				value: state[action.controlId].value.map((i, id) => {
					if (id === action.repeaterParentItemId) {
						return {
							...i,
							[action.repeaterId]: arraySortItems({
								args: action.items,
								toIndex: action.toIndex,
								fromIndex: action.fromIndex,
							}),
						};
					}

					return i;
				}),
			},
		};
	}

	//by default behavior of "sortRepeaterItem" action
	return {
		...state,
		[action.controlId]: {
			...state[action.controlId],
			value: arraySortItems({
				args: action.items,
				toIndex: action.toIndex,
				fromIndex: action.fromIndex,
			}),
		},
	};
}

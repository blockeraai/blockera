/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	hasRepeaterId,
	repeaterOnChange,
	renameRepeaterItemByTypeValue,
} from './utils';

export function renameItemByType(state = {}, action) {
	const controlInfo = state[action.controlId];

	if (hasRepeaterId(controlInfo.value, action, false)) {
		return state;
	}

	const newValue = renameRepeaterItemByTypeValue(
		controlInfo.value,
		state,
		action
	);

	if (null === newValue || isEquals(newValue, controlInfo.value)) {
		return state;
	}

	repeaterOnChange(newValue, action);

	return {
		...state,
		[action.controlId]: {
			...controlInfo,
			value: newValue,
		},
	};
}

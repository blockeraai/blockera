/**
 * External dependencies
 */
import createSelector from 'rememo';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isEmpty, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from './constants';

export const getControls = createSelector(
	(state) => Object.values(state.controlReducer),
	(state) => [state.controlReducer]
);

export const getControl = (state, fieldName) => {
	return state.controlReducer[fieldName] || undefined;
};

export const getControlValue = (controlName, store = STORE_NAME) => {
	const { getControl } = select(store);
	const control = getControl(controlName);

	if (isUndefined(control)) {
		return control;
	}

	if (isUndefined(control?.value) || !isEmpty(control?.value)) {
		return control?.value || undefined;
	}

	return control.value;
};

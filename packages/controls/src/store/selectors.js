/**
 * External dependencies
 */
import createSelector from 'rememo';
import { select } from '@wordpress/data';
/**
 * Internal dependencies
 */
import { STORE_NAME } from './constants';

export const getControls = createSelector(
	(state) => Object.values(state.controlReducer),
	(state) => [state.controlReducer]
);

export const getControl = (state, fieldName) => {
	return state.controlReducer[fieldName];
};

export const getControlValue = (controlName) => {
	const { getControl } = select(STORE_NAME);

	return getControl(controlName)?.value || undefined;
};

// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../store/constants';

export const useEditorStore = (): Object => {
	const { availableStates, availableBreakpoints, getState } = useSelect(
		(select) => {
			const { getAvailableStates, getAvailableBreakpoints, getState } =
				select(STORE_NAME);

			return {
				getState,
				availableStates: getAvailableStates(),
				availableBreakpoints: getAvailableBreakpoints(),
			};
		}
	);

	return {
		getState,
		availableStates,
		availableBreakpoints,
	};
};

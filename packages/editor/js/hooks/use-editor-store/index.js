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
	const {
		getState,
		getInnerState,
		availableStates,
		availableBreakpoints,
		getAvailableInnerState,
	} = useSelect((select) => {
		const {
			getState,
			getInnerState,
			getAvailableStates,
			getAvailableInnerState,
			getAvailableBreakpoints,
		} = select(STORE_NAME);

		return {
			getState,
			getInnerState,
			getAvailableInnerState,
			availableStates: getAvailableStates(),
			availableBreakpoints: getAvailableBreakpoints(),
		};
	});

	return {
		getState,
		getInnerState,
		availableStates,
		availableBreakpoints,
		getAvailableInnerState,
	};
};

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
		availableInnerState,
		availableBreakpoints,
	} = useSelect((select) => {
		const {
			getState,
			getInnerState,
			getAvailableStates,
			getAvailableInnerStates,
			getAvailableBreakpoints,
		} = select(STORE_NAME);

		return {
			getState,
			getInnerState,
			availableStates: getAvailableStates(),
			availableInnerState: getAvailableInnerStates(),
			availableBreakpoints: getAvailableBreakpoints(),
		};
	});

	return {
		getState,
		getInnerState,
		availableStates,
		availableInnerState,
		availableBreakpoints,
	};
};

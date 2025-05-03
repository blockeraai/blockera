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
	const { availableStates, availableBreakpoints } = useSelect((select) => {
		const { getAvailableStates, getAvailableBreakpoints } =
			select(STORE_NAME);

		return {
			availableStates: getAvailableStates(),
			availableBreakpoints: getAvailableBreakpoints(),
		};
	});

	return {
		availableStates,
		availableBreakpoints,
	};
};

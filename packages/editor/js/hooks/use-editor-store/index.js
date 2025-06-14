// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../store/constants';

export const useEditorStore = (
	options: { list: boolean } = { list: false }
): Object => {
	const {
		getState,
		getInnerState,
		availableStates,
		availableInnerStates,
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
			availableStates: getAvailableStates(options.list),
			availableInnerStates: getAvailableInnerStates(options.list),
			availableBreakpoints: getAvailableBreakpoints(options.list),
		};
	});

	return {
		getState,
		getInnerState,
		availableStates,
		availableInnerStates,
		availableBreakpoints,
	};
};

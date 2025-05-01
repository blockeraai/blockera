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
	const { availableStates } = useSelect((select) => {
		const { getAvailableStates } = select(STORE_NAME);

		return {
			availableStates: getAvailableStates(),
		};
	});

	return {
		availableStates,
	};
};

// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

/**
 * Hook to reset block state to normal.
 *
 * @param {Object} params - The parameters.
 * @param {string} params.clientId - The block client ID.
 * @param {string} params.blockName - The block name.
 * @param {Object} params.statesManagerHandleOnChangeRef - Ref object with current property containing handleOnChange function or null.
 * @return {Function} Function to reset block state to normal.
 */
export const useResetBlockStateToNormal = ({
	clientId,
	blockName,
	statesManagerHandleOnChangeRef,
}: {
	clientId: string,
	blockName: string,
	statesManagerHandleOnChangeRef: {
		current: ((value: Object) => void) | null,
	},
}): (() => void) => {
	return useCallback(() => {
		// Call handleOnChange from StatesManager to reset to normal state
		const handleOnChange = statesManagerHandleOnChangeRef.current;
		if (!handleOnChange) {
			return;
		}

		// Get current block states from the store
		const blockeraExtensionsStore = select('blockera/extensions');
		const { getBlockStates, getExtensionCurrentBlockStateBreakpoint } =
			blockeraExtensionsStore;
		const currentStates = getBlockStates(clientId, blockName) || {};
		const statesToReset: Object = {};

		// Get all state keys from current states
		const stateKeys = Object.keys(currentStates);

		// If we have states, reset them with normal selected
		if (stateKeys.length > 0) {
			const currentBreakpoint = getExtensionCurrentBlockStateBreakpoint();
			stateKeys.forEach((stateKey) => {
				const state = currentStates[stateKey] || {};
				statesToReset[stateKey] = {
					...state,
					isSelected: stateKey === 'normal',
					breakpoints: state.breakpoints || {
						[currentBreakpoint]: { attributes: {} },
					},
				};
			});
		} else {
			// If no states exist, create a minimal normal state
			const currentBreakpoint = getExtensionCurrentBlockStateBreakpoint();
			statesToReset.normal = {
				isSelected: true,
				breakpoints: {
					[currentBreakpoint]: { attributes: {} },
				},
			};
		}

		handleOnChange(statesToReset);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId, blockName]);
};

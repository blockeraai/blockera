// @flow

/**
 * External dependencies
 */
import { useCallback } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../../../../components/utils';
import { GLOBAL_STYLES_EXTENSION_UI_CONTEXTS } from '../../../../components/extensions-ui-context';

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
	extensionsUiContext,
	resetAllGlobalStylesSurfaces = false,
}: {
	clientId: string,
	blockName: string,
	statesManagerHandleOnChangeRef: {
		current: ((value: Object) => void) | null,
	},
	extensionsUiContext?: string,
	resetAllGlobalStylesSurfaces?: boolean,
}): (() => void) => {
	return useCallback(() => {
		// Call handleOnChange from StatesManager to reset to normal state
		const handleOnChange = statesManagerHandleOnChangeRef.current;
		if (!handleOnChange) {
			return;
		}

		// Get current block states from the store
		const blockeraExtensionsSelect = select('blockera/extensions');
		const {
			getBlockStates,
			getExtensionCurrentBlockStateBreakpoint,
			getExtensionCurrentBlock,
		} = blockeraExtensionsSelect;
		const currentStates = getBlockStates(clientId, blockName) || {};
		const statesToReset: Object = {};

		// Change the extension current block to master to reset the block state to normal.
		const { changeExtensionCurrentBlock } = dispatch('blockera/extensions');

		if (resetAllGlobalStylesSurfaces) {
			GLOBAL_STYLES_EXTENSION_UI_CONTEXTS.forEach((uiContext) => {
				if (isInnerBlock(getExtensionCurrentBlock(uiContext))) {
					changeExtensionCurrentBlock('master', uiContext);
				}
			});
		} else if (
			isInnerBlock(getExtensionCurrentBlock(extensionsUiContext))
		) {
			changeExtensionCurrentBlock('master', extensionsUiContext);
		} else if (
			!extensionsUiContext &&
			isInnerBlock(getExtensionCurrentBlock())
		) {
			changeExtensionCurrentBlock('master');
		}

		// Get all state keys from current states
		const stateKeys = Object.keys(currentStates);

		// Get the current breakpoint
		const currentBreakpoint = getExtensionCurrentBlockStateBreakpoint();

		// If we have states, reset them with normal selected
		if (stateKeys.length > 0) {
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

// @flow

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	computeBlockeraActiveColor,
	computeBlockeraVariationCssVars,
} from './blockera-active-color';
import { useEditorStore, useExtensionsStore } from '../../hooks';

/**
 * Shared active color + variation CSS variables for StateContainer and inspector tabs.
 *
 * @param {Object} options Same inputs as StateContainer.
 * @return {{ activeColor: string|void, variationCssVars: Object|void }} Resolved active color and variation CSS variables.
 */
export function useBlockeraActiveColor({
	name,
	clientId,
	availableStates,
	blockeraUnsavedData,
	insideBlockInspector = true,
	isGlobalStylesPanelRoot = false,
	isGlobalStylesCardWrapper = false,
	variationSurface,
}: Object): {
	activeColor: string | void,
	variationCssVars: Object | void,
} {
	const { currentBlock, currentState, currentInnerBlockState } =
		useExtensionsStore({ name, clientId });
	const { getState, getInnerState } = useEditorStore();

	const activeColor = useMemo(
		() =>
			computeBlockeraActiveColor({
				currentBlock,
				currentState,
				currentInnerBlockState,
				getState,
				getInnerState,
				availableStates,
				blockeraUnsavedData,
				insideBlockInspector,
				isGlobalStylesPanelRoot,
				isGlobalStylesCardWrapper,
				variationSurface,
			}),
		[
			currentBlock,
			currentState,
			availableStates,
			blockeraUnsavedData,
			insideBlockInspector,
			currentInnerBlockState,
			isGlobalStylesPanelRoot,
			isGlobalStylesCardWrapper,
			variationSurface,
			getState,
			getInnerState,
		]
	);

	const variationCssVars = useMemo(
		() =>
			computeBlockeraVariationCssVars({
				isGlobalStylesCardWrapper,
				currentBlock,
				isGlobalStylesPanelRoot,
				currentState,
				variationSurface,
			}),
		[
			isGlobalStylesCardWrapper,
			currentBlock,
			isGlobalStylesPanelRoot,
			currentState,
			variationSurface,
		]
	);

	return { activeColor, variationCssVars };
}

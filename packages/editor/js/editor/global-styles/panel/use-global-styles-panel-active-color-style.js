// @flow

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getBlockeraActiveColorStyleProperties } from '../../../extensions/components/blockera-active-color';
import { useBlockeraActiveColor } from '../../../extensions/components/use-blockera-active-color';
import { isInnerBlock } from '../../../extensions/components/utils';
import { useExtensionsStore } from '../../../hooks';
import { useGlobalStylesPanelContext } from './context';

/**
 * Inline style for global-styles popovers — mirrors StateContainer active color.
 *
 * @param {string} blockName Registered block type name.
 * @return {Object} React style object with Blockera CSS custom properties.
 */
export function useGlobalStylesPanelActiveColorStyle(
	blockName: string
): Object {
	const { fallbackClientId, variationSurface, style } =
		useGlobalStylesPanelContext();
	const { currentBlock } = useExtensionsStore({
		name: blockName,
		clientId: fallbackClientId,
	});
	const isMasterScope = !isInnerBlock(currentBlock);

	const { activeColor, variationCssVars } = useBlockeraActiveColor({
		name: blockName,
		clientId: fallbackClientId,
		blockeraUnsavedData: style?.blockeraUnsavedData,
		insideBlockInspector: false,
		isGlobalStylesPanelRoot: isMasterScope,
		isGlobalStylesCardWrapper: isMasterScope,
		variationSurface,
	});

	return useMemo(
		() =>
			getBlockeraActiveColorStyleProperties(
				activeColor,
				variationCssVars
			),
		[activeColor, variationCssVars]
	);
}

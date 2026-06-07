// @flow

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { PopoverActiveColorStyleProvider } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { getBlockeraActiveColorStyleProperties } from '../../../components/blockera-active-color';
import { useBlockeraActiveColor } from '../../../components/use-blockera-active-color';
import { isInnerBlock } from '../../../components/utils';
import { useGlobalStylesPanelContext } from '../../../../editor/global-styles/panel/context';
import { getExtensionsUiContext } from '../../../components/extensions-ui-context';

/**
 * Popover active-color scope for block-composite preview (states / inner-blocks inserters).
 *
 * Preview UI sits beside — not inside — the variation/inner-block StateContainer, so it
 * needs its own provider with store-driven colors for the current block + state target.
 */
export function PreviewActiveColorProvider({
	blockName,
	clientId,
	children,
	availableStates,
	blockeraUnsavedData,
	insideBlockInspector = true,
}: {
	blockName: string,
	clientId: string,
	children: MixedElement,
	availableStates?: Object,
	blockeraUnsavedData?: Object,
	insideBlockInspector?: boolean,
}): MixedElement {
	const { variationSurface } = useGlobalStylesPanelContext();
	const inGlobalStyles = !insideBlockInspector;
	const extensionsUiContext = getExtensionsUiContext(
		insideBlockInspector,
		inGlobalStyles ? variationSurface : undefined
	);
	const currentBlock = useSelect(
		(select) =>
			select('blockera/extensions')?.getExtensionCurrentBlock?.(
				extensionsUiContext
			) ?? 'master',
		[extensionsUiContext]
	);
	const isMasterScope = !isInnerBlock(currentBlock);

	const { activeColor, variationCssVars } = useBlockeraActiveColor({
		name: blockName,
		clientId,
		availableStates,
		blockeraUnsavedData,
		insideBlockInspector,
		isGlobalStylesPanelRoot: inGlobalStyles && isMasterScope,
		isGlobalStylesCardWrapper: inGlobalStyles && isMasterScope,
		variationSurface: inGlobalStyles ? variationSurface : undefined,
	});

	const popoverActiveColorStyle = useMemo(
		() =>
			getBlockeraActiveColorStyleProperties(
				activeColor,
				variationCssVars
			),
		[activeColor, variationCssVars]
	);

	return (
		<PopoverActiveColorStyleProvider value={popoverActiveColorStyle}>
			{children}
		</PopoverActiveColorStyleProvider>
	);
}

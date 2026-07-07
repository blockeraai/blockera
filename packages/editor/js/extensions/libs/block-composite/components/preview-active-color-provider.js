// @flow

/**
 * External dependencies
 */
import { useContext, useMemo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getBlockeraActiveColorScopeFlags } from '../../../components/blockera-active-color';
import { useBlockeraActiveColor } from '../../../components/use-blockera-active-color';
import { Container } from '../../../components/state-container';
import { GlobalStylesPanelContext } from '../../../../editor/global-styles/panel/context';

export type PreviewActiveColorProviderInputProps = {
	blockName: string,
	clientId: string,
	availableStates?: Object,
	blockeraUnsavedData?: Object,
	insideBlockInspector?: boolean,
	variationSurface?: string,
};

/**
 * Props that drive {@see PreviewActiveColorProvider} re-renders (excludes `children`).
 * Matches StateContainer's active-color inputs beside the preview in global styles.
 */
export function arePreviewActiveColorProviderPropsEqual(
	prevProps: PreviewActiveColorProviderInputProps,
	nextProps: PreviewActiveColorProviderInputProps
): boolean {
	return (
		prevProps.blockName === nextProps.blockName &&
		prevProps.clientId === nextProps.clientId &&
		prevProps.insideBlockInspector === nextProps.insideBlockInspector &&
		prevProps.variationSurface === nextProps.variationSurface &&
		prevProps.availableStates === nextProps.availableStates &&
		isEquals(
			prevProps.blockeraUnsavedData?.states,
			nextProps.blockeraUnsavedData?.states
		)
	);
}

/**
 * Stable provider inputs for block-composite Preview — keyed on the same slices
 * {@see useBlockeraActiveColor} reads from `blockeraUnsavedData`.
 */
export function useStablePreviewActiveColorProviderProps({
	blockName,
	clientId,
	availableStates,
	blockeraUnsavedData,
	insideBlockInspector = true,
	variationSurface,
}: PreviewActiveColorProviderInputProps): PreviewActiveColorProviderInputProps {
	return useMemo(
		() => ({
			blockName,
			clientId,
			availableStates,
			blockeraUnsavedData,
			insideBlockInspector,
			variationSurface,
		}),
		[
			blockName,
			clientId,
			availableStates,
			insideBlockInspector,
			variationSurface,
			blockeraUnsavedData?.states,
		]
	);
}

/**
 * Popover active-color scope for block-composite preview (states / inner-blocks inserters).
 *
 * Preview UI sits beside — not inside — the variation/inner-block StateContainer, so it
 * needs its own provider with store-driven colors for the current block + state target.
 *
 * Flag rules mirror {@see StateContainer} via {@see getBlockeraActiveColorScopeFlags};
 * inner-block vs master scope is resolved inside {@see useBlockeraActiveColor}.
 */
export function PreviewActiveColorProvider({
	blockName,
	clientId,
	children,
	availableStates,
	blockeraUnsavedData,
	insideBlockInspector = true,
	variationSurface: variationSurfaceProp,
}: {
	...PreviewActiveColorProviderInputProps,
	children: MixedElement,
}): MixedElement {
	const panelContext = useContext(GlobalStylesPanelContext);
	const resolvedVariationSurface = insideBlockInspector
		? undefined
		: (variationSurfaceProp ?? panelContext?.variationSurface);

	const scopeFlags = getBlockeraActiveColorScopeFlags({
		insideBlockInspector,
		isGlobalStylesPanelRoot: false,
		variationSurface: resolvedVariationSurface,
	});

	const { activeColor, variationCssVars } = useBlockeraActiveColor({
		name: blockName,
		clientId,
		availableStates,
		blockeraUnsavedData,
		...scopeFlags,
	});

	return (
		<Container
			activeColor={activeColor}
			variationCssVars={variationCssVars}
			variationSurface={scopeFlags.variationSurface}
		>
			{children}
		</Container>
	);
}

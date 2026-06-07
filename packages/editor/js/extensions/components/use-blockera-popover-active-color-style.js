// @flow

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getBlockeraActiveColorStyleProperties } from './blockera-active-color';
import { useBlockeraActiveColor } from './use-blockera-active-color';
import { isInnerBlock } from './utils';
import { useExtensionsStore } from '../../hooks';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../../editor/global-styles/panel/variation-surfaces';

const GLOBAL_STYLES_COMPLEMENTARY_AREA = 'edit-site/global-styles';

export type BlockeraPopoverActiveColorOptions = {
	name?: string,
	clientId?: string,
	variationSurface?: string,
	blockeraUnsavedData?: Object,
	isGlobalStylesCardWrapper?: boolean,
};

/**
 * Fallback client id used by the global-styles panel (matches panel context).
 *
 * @param {string} blockName Registered block type name.
 * @param {string|void} styleVariationName Active style variation name.
 * @return {string} Synthetic client id for extension state.
 */
export function getGlobalStylesPanelFallbackClientId(
	blockName: string,
	styleVariationName?: string
): string {
	const fallbackClientId = blockName.replace('/', '-');

	return styleVariationName
		? `${styleVariationName}-${fallbackClientId}`
		: fallbackClientId;
}

/**
 * Whether the site editor global-styles sidebar is active.
 *
 * @param {Function} select WordPress data select.
 * @return {boolean} True when the global-styles complementary area is open.
 */
export function isGlobalStylesPanelOpen(select: Function): boolean {
	const { getActiveComplementaryArea } = select('core/interface') || {};

	return (
		getActiveComplementaryArea?.('core/edit-site') ===
		GLOBAL_STYLES_COMPLEMENTARY_AREA
	);
}

/**
 * Resolve block name + client id for popovers from blockera/editor stores.
 *
 * @param {BlockeraPopoverActiveColorOptions|void} options Optional overrides.
 * @return {{ blockName: string, clientId: string, inGlobalStyles: boolean, variationSurface: string|void }} Store-derived popover block context.
 */
export function useBlockeraPopoverColorContext(
	options?: BlockeraPopoverActiveColorOptions
): {
	blockName: string,
	clientId: string,
	inGlobalStyles: boolean,
	variationSurface: string | void,
} {
	return useSelect(
		(select) => {
			const editorSelect = select('blockera/editor') || {};
			const blockEditorSelect = select('core/block-editor') || {};
			const inGlobalStyles = isGlobalStylesPanelOpen(select);
			const selectedBlock = blockEditorSelect.getSelectedBlock?.();
			const blockName =
				options?.name ??
				(inGlobalStyles
					? editorSelect.getSelectedBlockStyle?.() || ''
					: selectedBlock?.name || '');

			let clientId = options?.clientId || '';

			if (!clientId) {
				if (inGlobalStyles && blockName) {
					const styleVariation =
						editorSelect.getSelectedBlockStyleVariation?.();

					clientId = getGlobalStylesPanelFallbackClientId(
						blockName,
						styleVariation?.name
					);
				} else {
					clientId = selectedBlock?.clientId || '';
				}
			}

			let variationSurface = options?.variationSurface;

			if (!variationSurface && inGlobalStyles) {
				const sizeVariation =
					editorSelect.getSelectedBlockSizeVariation?.();
				const styleVariation =
					editorSelect.getSelectedBlockStyleVariation?.();

				if (sizeVariation?.name && !styleVariation?.name) {
					variationSurface = VARIATION_SURFACE_SIZE;
				} else {
					variationSurface = VARIATION_SURFACE_STYLE;
				}
			}

			return {
				blockName,
				clientId,
				inGlobalStyles,
				variationSurface,
			};
		},
		[options?.name, options?.clientId, options?.variationSurface]
	);
}

/**
 * Inline Blockera active-color CSS variables for portaled popovers.
 *
 * Reads `blockera/editor` + `blockera/extensions` — same rules as StateContainer,
 * without DOM observers or copying styles from `.blockera-state-colors-container`.
 *
 * @param {BlockeraPopoverActiveColorOptions|void} options Optional scope overrides.
 * @return {Object} React style object for popover roots.
 */
export function useBlockeraPopoverActiveColorStyle(
	options?: BlockeraPopoverActiveColorOptions
): Object {
	const { blockName, clientId, inGlobalStyles, variationSurface } =
		useBlockeraPopoverColorContext(options);
	const { currentBlock } = useExtensionsStore({
		name: blockName,
		clientId,
		variationSurface: inGlobalStyles ? variationSurface : undefined,
	});
	const isMasterScope = !isInnerBlock(currentBlock);
	const isGlobalStylesCardWrapper =
		options?.isGlobalStylesCardWrapper ?? (inGlobalStyles && isMasterScope);

	const { activeColor, variationCssVars } = useBlockeraActiveColor({
		name: blockName,
		clientId,
		blockeraUnsavedData: options?.blockeraUnsavedData,
		insideBlockInspector: !inGlobalStyles,
		isGlobalStylesPanelRoot: inGlobalStyles && isMasterScope,
		isGlobalStylesCardWrapper,
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

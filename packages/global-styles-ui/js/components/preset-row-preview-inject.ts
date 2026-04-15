/**
 * External dependencies
 */
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	useBlockInjectedSlotClientId,
	usePreviewInjectableStyles,
} from '@blockera/controls';

/**
 * CSS rule targeting the selected block in the canvas (`#block-{clientId}`), or a list fallback.
 */
export function buildPresetRowBlockCanvasCss(
	blockClientId: string | null | undefined,
	cssDeclarations: string
): string {
	const d = cssDeclarations.trim();
	if (!d) {
		return '';
	}
	const target = blockClientId
		? `#block-${blockClientId}`
		: '.block-editor-block-list__layout .block-editor-block-list__block';
	return `${target} { ${d} }`;
}

/**
 * Wires repeater row hover to {@link usePreviewInjectableStyles} (block inspector → BlockStyle).
 *
 * @param getDeclarations CSS declarations only (no `{}`), e.g. `box-shadow: 0 1px red !important`
 */
export function usePresetRowPreviewInject(getDeclarations: () => string): {
	onMouseEnter: () => void;
	onMouseLeave: () => void;
} {
	const previewInjectable = usePreviewInjectableStyles();
	const blockClientId = useBlockInjectedSlotClientId();

	const handlePointerEnter = useCallback(() => {
		if (!previewInjectable) {
			return;
		}
		const css = buildPresetRowBlockCanvasCss(
			blockClientId,
			getDeclarations()
		);
		if (css) {
			previewInjectable.setExtraPreviewCss(css);
		}
	}, [previewInjectable, blockClientId, getDeclarations]);

	const handlePointerLeave = useCallback(() => {
		previewInjectable?.setExtraPreviewCss('');
	}, [previewInjectable]);

	return {
		onMouseEnter: handlePointerEnter,
		onMouseLeave: handlePointerLeave,
	};
}

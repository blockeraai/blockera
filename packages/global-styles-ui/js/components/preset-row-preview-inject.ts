/**
 * External dependencies
 */
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	useBlockInjectedSlotClientId,
	usePresetCanvasPreview,
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

export type PresetCanvasPreviewPayload =
	| {
			kind: 'attributes';
			patch: Record<string, unknown>;
	  }
	| {
			/** CSS declarations only (no `{}`), e.g. `box-shadow: 0 1px red !important` */
			kind: 'declarations';
			declarations: string;
	  };

/**
 * Wires repeater row hover to canvas preview: attribute patch → second BlockStyle, or
 * declaration string → PreviewInjectableStylesContext (gradients / fallback raw CSS).
 */
export function usePresetRowCanvasPreview(
	getPayload: () => PresetCanvasPreviewPayload | null
): {
	onMouseEnter: () => void;
	onMouseLeave: () => void;
} {
	const presetCanvas = usePresetCanvasPreview();
	const previewInjectable = usePreviewInjectableStyles();
	const blockClientId = useBlockInjectedSlotClientId();

	const handlePointerEnter = useCallback(() => {
		const payload = getPayload();
		if (!payload) {
			presetCanvas?.setPreviewAttributePatch(null);
			previewInjectable?.setExtraPreviewCss('');
			return;
		}

		let willShowPreview = false;
		if (payload.kind === 'attributes') {
			willShowPreview = Object.keys(payload.patch || {}).length > 0;
		} else {
			willShowPreview = (payload.declarations?.trim() ?? '').length > 0;
		}

		if (willShowPreview) {
			presetCanvas?.primePresetHover?.();
		}

		if (payload.kind === 'attributes') {
			previewInjectable?.setExtraPreviewCss('');
			const patch = payload.patch || {};
			const keys = Object.keys(patch);
			presetCanvas?.setPreviewAttributePatch(keys.length ? patch : null);
			return;
		}

		presetCanvas?.setPreviewAttributePatch(null);
		const d = payload.declarations?.trim() ?? '';
		if (!d) {
			previewInjectable?.setExtraPreviewCss('');
			return;
		}
		const css = buildPresetRowBlockCanvasCss(blockClientId, d);
		if (css) {
			previewInjectable?.setExtraPreviewCss(css);
		}
	}, [presetCanvas, previewInjectable, blockClientId, getPayload]);

	const handlePointerLeave = useCallback(() => {
		presetCanvas?.setPreviewAttributePatch(null);
		previewInjectable?.setExtraPreviewCss('');
	}, [presetCanvas, previewInjectable]);

	return {
		onMouseEnter: handlePointerEnter,
		onMouseLeave: handlePointerLeave,
	};
}

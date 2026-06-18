/**
 * External dependencies
 */
import { useCallback, useEffect } from '@wordpress/element';

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

let isPresetRowCanvasPreviewActive = false;
let sharedClearPresetRowCanvasPreview: (() => void) | null = null;
let mountedPresetRowPreviewHookCount = 0;

/**
 * Clears active preset-row canvas preview when a host popover closes without a row
 * `mouseleave` (e.g. value-addon variable picker dismiss while hovering a preset).
 */
export function clearActivePresetRowCanvasPreview(): void {
	if (!isPresetRowCanvasPreviewActive) {
		return;
	}
	sharedClearPresetRowCanvasPreview?.();
}

/**
 * Merges value-addon picker props so var-picker `onClose` clears preset hover preview CSS.
 */
export function mergePickerPropsWithPresetRowPreviewClose(
	pickerProps: Record<string, unknown>
): Record<string, unknown> {
	const previousOnClose = pickerProps.onClose;
	return {
		...pickerProps,
		onClose: () => {
			clearActivePresetRowCanvasPreview();
			if (typeof previousOnClose === 'function') {
				previousOnClose();
			}
		},
	};
}

/**
 * Wires repeater row hover to canvas preview: attribute patch → second BlockStyle, or
 * declaration string → PreviewInjectableStylesContext (gradients / fallback raw CSS).
 */
export function usePresetRowCanvasPreview(
	getPayload: () => PresetCanvasPreviewPayload | null
): {
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onClick: () => void;
} {
	const presetCanvas = usePresetCanvasPreview();
	const previewInjectable = usePreviewInjectableStyles();
	const blockClientId = useBlockInjectedSlotClientId();

	const clearPreviewState = useCallback(() => {
		if (!isPresetRowCanvasPreviewActive) {
			return;
		}
		isPresetRowCanvasPreviewActive = false;
		presetCanvas?.setPreviewAttributePatch(null);
		previewInjectable?.setExtraPreviewCss('');
	}, [presetCanvas, previewInjectable]);

	const handlePointerEnter = useCallback(() => {
		const payload = getPayload();
		if (!payload) {
			clearPreviewState();
			return;
		}

		let willShowPreview = false;
		if (payload.kind === 'attributes') {
			willShowPreview = Object.keys(payload.patch || {}).length > 0;
		} else {
			willShowPreview = (payload.declarations?.trim() ?? '').length > 0;
		}

		if (!willShowPreview) {
			clearPreviewState();
			return;
		}

		isPresetRowCanvasPreviewActive = true;
		presetCanvas?.primePresetHover?.();

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
			clearPreviewState();
			return;
		}
		const css = buildPresetRowBlockCanvasCss(blockClientId, d);
		if (css) {
			previewInjectable?.setExtraPreviewCss(css);
			return;
		}
		clearPreviewState();
	}, [
		presetCanvas,
		previewInjectable,
		blockClientId,
		getPayload,
		clearPreviewState,
	]);

	const handlePointerLeave = useCallback(() => {
		clearPreviewState();
	}, [clearPreviewState]);

	useEffect(() => {
		mountedPresetRowPreviewHookCount += 1;
		sharedClearPresetRowCanvasPreview = clearPreviewState;

		return () => {
			mountedPresetRowPreviewHookCount -= 1;
			if (mountedPresetRowPreviewHookCount === 0) {
				sharedClearPresetRowCanvasPreview = null;
			}
			clearPreviewState();
		};
	}, [clearPreviewState]);

	return {
		onMouseEnter: handlePointerEnter,
		onMouseLeave: handlePointerLeave,
		onClick: handlePointerLeave,
	};
}

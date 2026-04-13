/**
 * Shared zoom keyboard handling for main window and same-origin iframes.
 * Parent window listeners do not receive key events when focus is inside a child iframe.
 */

import { ZOOM_STEP, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from './constants';

/**
 * Context for handling zoom keyboard shortcuts.
 */
export interface ZoomKeyboardHandlerContext {
	/** Current zoom percentage (use a ref in callers for fresh values). */
	getZoomPercent: () => number;
	/** Apply new zoom (should clamp to MIN_ZOOM–MAX_ZOOM). */
	onZoomChange: (nextZoom: number) => void;
	/** Optional: Cmd/Ctrl+Shift+1 zoom-to-fit. */
	onZoomToFit?: () => void;
}

function clampZoom(zoom: number): number {
	return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
}

/**
 * Handle Blockera zoom keyboard shortcuts (+/-/0, zoom-to-fit).
 * Skips when the event target is an input, textarea, or contenteditable.
 *
 * @param event - keydown event.
 * @param ctx   - Zoom callbacks and current zoom accessor.
 * @return true if the event was consumed (zoom shortcut matched).
 */
export function handleZoomKeyboardEvent(
	event: KeyboardEvent,
	ctx: ZoomKeyboardHandlerContext
): boolean {
	const target = event.target;
	if (
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		(target instanceof HTMLElement && target.isContentEditable)
	) {
		return false;
	}

	const isMod = event.metaKey || event.ctrlKey;
	const isShift = event.shiftKey;
	const isAlt = event.altKey;

	const isOne =
		event.key === '1' ||
		event.key === 'Digit1' ||
		event.code === 'Digit1' ||
		event.code === 'Numpad1';

	if (isMod && isShift && isOne && !isAlt) {
		event.preventDefault();
		event.stopPropagation();
		if (ctx.onZoomToFit) {
			ctx.onZoomToFit();
		}
		return true;
	}

	if (!isMod) {
		return false;
	}

	const isPlus =
		event.key === '+' ||
		(event.key === '=' && isMod) ||
		(event.key === '=' && event.shiftKey) ||
		event.code === 'NumpadAdd' ||
		(event.code === 'Equal' && isMod);

	const isMinus =
		event.key === '-' ||
		event.code === 'Minus' ||
		event.code === 'NumpadSubtract';

	const isZero = event.key === '0' || event.key === 'Digit0';

	if (isPlus) {
		event.preventDefault();
		event.stopPropagation();
		ctx.onZoomChange(clampZoom(ctx.getZoomPercent() + ZOOM_STEP));
		return true;
	}
	if (isMinus) {
		event.preventDefault();
		event.stopPropagation();
		ctx.onZoomChange(clampZoom(ctx.getZoomPercent() - ZOOM_STEP));
		return true;
	}
	if (isZero) {
		event.preventDefault();
		event.stopPropagation();
		ctx.onZoomChange(DEFAULT_ZOOM);
		return true;
	}

	return false;
}

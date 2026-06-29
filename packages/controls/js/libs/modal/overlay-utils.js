// @flow

/**
 * WordPress modals render inside a dedicated screen overlay. Popovers also use
 * role="dialog" but never mount this overlay, so it is a reliable open-modal signal.
 */
export const MODAL_OVERLAY_SELECTOR = '.components-modal__screen-overlay';

/**
 * WordPress media library modal (used by MediaUploader in background/image controls).
 */
export const MEDIA_MODAL_SELECTOR = '.media-modal, .media-modal-backdrop';

export function hasOpenMediaModal(): boolean {
	return document.querySelector('.media-modal') !== null;
}

export function isElementInsideMediaModal(element: Element): boolean {
	return Boolean(
		element.closest('.media-modal') ||
		element.closest('.media-modal-backdrop')
	);
}

export function hasOpenModalOverlay(): boolean {
	return (
		document.querySelector(MODAL_OVERLAY_SELECTOR) !== null ||
		hasOpenMediaModal()
	);
}

export function isElementInsideModalOverlay(element: Element): boolean {
	return (
		Boolean(element.closest(MODAL_OVERLAY_SELECTOR)) ||
		isElementInsideMediaModal(element)
	);
}

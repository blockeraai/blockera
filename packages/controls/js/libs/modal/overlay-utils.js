// @flow

/**
 * WordPress modals render inside a dedicated screen overlay. Popovers also use
 * role="dialog" but never mount this overlay, so it is a reliable open-modal signal.
 */
export const MODAL_OVERLAY_SELECTOR = '.components-modal__screen-overlay';

export function hasOpenModalOverlay(): boolean {
	return document.querySelector(MODAL_OVERLAY_SELECTOR) !== null;
}

export function isElementInsideModalOverlay(element: Element): boolean {
	return Boolean(element.closest(MODAL_OVERLAY_SELECTOR));
}

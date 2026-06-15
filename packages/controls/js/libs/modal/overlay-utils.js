// @flow

export const MODAL_OVERLAY_SELECTOR =
	'.components-modal__screen-overlay, .components-modal__frame, .components-modal, .components-modal__content, .blockera-component-modal, .blockera-component-delete-modal, [role="dialog"]';

export function hasOpenModalOverlay(): boolean {
	return document.querySelector(MODAL_OVERLAY_SELECTOR) !== null;
}

export function isElementInsideModalOverlay(element: Element): boolean {
	return Boolean(element.closest(MODAL_OVERLAY_SELECTOR));
}

// @flow

import {
	hasOpenModalOverlay,
	isElementInsideModalOverlay,
} from '../modal/overlay-utils';

export const INSPECTOR_SIDEBAR_SELECTORS: Array<string> = [
	'.interface-interface-skeleton__sidebar',
	'.blockera-tabbed-sidebar',
];

export const LEFT_PLACEMENTS: Array<string> = [
	'left',
	'left-start',
	'left-end',
];
export const RIGHT_PLACEMENTS: Array<string> = [
	'right',
	'right-start',
	'right-end',
];

export const DEFAULT_POPOVER_OFFSET = 25;

export const VALUE_ADDON_OPENER_SELECTORS =
	'.blockera-control-value-addon-pointer.open-value-addon, [data-cy="value-addon-btn"].open-value-addon, .blockera-control-value-addon.open-value-addon';

export const FOCUS_OPENER_SELECTORS =
	'.is-focus, .is-open-popover, [data-cy="label-control"].is-open';

export const POPOVER_ANCHOR_SCOPE_SELECTORS: string = [
	'.blockera-control-value-addon-pointers',
	'.blockera-field-control',
	'.blockera-control-repeater-add-item-trigger',
	'.blockera-control-repeater',
	'.blockera-control-group',
	'.blockera-control',
].join(', ');

export function resolvePopoverAnchorElement(
	explicitAnchor: ?HTMLElement,
	fallbackAnchor: ?HTMLElement
): ?HTMLElement {
	if (explicitAnchor instanceof HTMLElement) {
		return explicitAnchor;
	}

	if (fallbackAnchor instanceof HTMLElement) {
		const scope =
			fallbackAnchor.closest(POPOVER_ANCHOR_SCOPE_SELECTORS) ||
			fallbackAnchor.parentElement;

		if (scope instanceof HTMLElement) {
			const valueAddonOpener = scope.querySelector(
				VALUE_ADDON_OPENER_SELECTORS
			);

			if (valueAddonOpener instanceof HTMLElement) {
				return valueAddonOpener;
			}

			const focusOpener = scope.querySelector(FOCUS_OPENER_SELECTORS);

			if (focusOpener instanceof HTMLElement) {
				return focusOpener;
			}

			// Keep offset math scoped to this control; avoid picking an unrelated
			// open value-addon elsewhere in the document.
			return fallbackAnchor;
		}
	}

	const globalValueAddonOpener = document.querySelector(
		VALUE_ADDON_OPENER_SELECTORS
	);

	if (globalValueAddonOpener instanceof HTMLElement) {
		return globalValueAddonOpener;
	}

	return fallbackAnchor;
}

export function getInspectorSidebarElement(anchor: ?HTMLElement): ?HTMLElement {
	if (!anchor) {
		return null;
	}

	for (const selector of INSPECTOR_SIDEBAR_SELECTORS) {
		const sidebar = anchor.closest(selector);
		if (sidebar instanceof HTMLElement) {
			return sidebar;
		}
	}

	const complementaryArea = anchor.closest('.interface-complementary-area');
	if (complementaryArea instanceof HTMLElement) {
		return complementaryArea;
	}

	return null;
}

export function computeInspectorPopoverOffset(
	anchor: ?HTMLElement,
	placement: string = 'bottom-start',
	inspectorGap: number = DEFAULT_POPOVER_OFFSET
): number {
	if (!anchor) {
		return inspectorGap;
	}

	const placementSide = placement.split('-')[0];
	const sidebar = getInspectorSidebarElement(anchor);

	if (!sidebar) {
		return inspectorGap;
	}

	const anchorRect = anchor.getBoundingClientRect();
	const sidebarRect = sidebar.getBoundingClientRect();

	if (LEFT_PLACEMENTS.includes(placementSide)) {
		return (
			Math.max(0, Math.round(anchorRect.left - sidebarRect.left)) +
			inspectorGap
		);
	}

	if (RIGHT_PLACEMENTS.includes(placementSide)) {
		return (
			Math.max(0, Math.round(sidebarRect.right - anchorRect.right)) +
			inspectorGap
		);
	}

	return inspectorGap;
}

export const POPOVER_ROOT_SELECTOR =
	'.blockera-component-popover, .components-popover';

export function getPopoverRoot(element: ?Node): ?HTMLElement {
	if (!element || !(element instanceof Element)) {
		return null;
	}

	const popover = element.closest(POPOVER_ROOT_SELECTOR);
	return popover instanceof HTMLElement ? popover : null;
}

export function normalizePopoverRoot(element: ?HTMLElement): ?HTMLElement {
	if (!(element instanceof HTMLElement)) {
		return null;
	}

	return getPopoverRoot(element) ?? element;
}

export const POPOVER_CLOSE_CONTROL_SELECTOR = '[data-test="close-popover"]';

let closingPopoverRoot: ?HTMLElement = null;
let closingClearTimer: ?TimeoutID = null;

/** Marks which popover is closing so parent popovers ignore the resulting dismiss events. */
export function markPopoverClosing(popoverRoot: ?HTMLElement): void {
	const normalizedRoot = normalizePopoverRoot(popoverRoot);

	if (!(normalizedRoot instanceof HTMLElement)) {
		return;
	}

	closingPopoverRoot = normalizedRoot;

	if (closingClearTimer) {
		clearTimeout(closingClearTimer);
	}

	// WordPress queues focus-outside checks via setTimeout(..., 0).
	closingClearTimer = setTimeout(() => {
		if (closingPopoverRoot === normalizedRoot) {
			closingPopoverRoot = null;
		}
		closingClearTimer = null;
	}, 100);
}

export function isOtherPopoverClosing(popoverRoot: ?HTMLElement): boolean {
	if (!(closingPopoverRoot instanceof HTMLElement)) {
		return false;
	}

	return closingPopoverRoot !== normalizePopoverRoot(popoverRoot);
}

export function getPopoverRootFromCloseControl(
	target: ?EventTarget
): ?HTMLElement {
	if (!(target instanceof Element)) {
		return null;
	}

	if (!target.closest(POPOVER_CLOSE_CONTROL_SELECTOR)) {
		return null;
	}

	return getPopoverRoot(target);
}

/**
 * Whether a pointer/focus target should keep the popover open:
 * - inside the current popover
 * - inside another popover (nested UI portaled outside the root)
 * - inside a modal opened from nested UI in the popover
 * - inside dropdown surfaces such as SelectControl menus
 */
export function isPopoverDismissIgnoredTarget(
	popoverRoot: ?HTMLElement,
	target: ?EventTarget
): boolean {
	if (!target || !(target instanceof Node)) {
		return false;
	}

	if (popoverRoot?.contains(target)) {
		return true;
	}

	if (!(target instanceof HTMLElement)) {
		return false;
	}

	if (isElementInsideModalOverlay(target)) {
		return true;
	}

	const nestedPopover = getPopoverRoot(target);
	if (nestedPopover instanceof HTMLElement && nestedPopover !== popoverRoot) {
		return true;
	}

	if (target.closest('.components-dropdown__content')) {
		return true;
	}

	return false;
}

/**
 * WordPress focus-outside often fires with a null relatedTarget while the user
 * interacts with portaled surfaces. Fall back to activeElement in that case.
 */
export function shouldIgnorePopoverFocusOutside(
	event: FocusEvent,
	popoverRoot: ?HTMLElement
): boolean {
	if (isOtherPopoverClosing(popoverRoot)) {
		return true;
	}

	const closeControlRoot = getPopoverRootFromCloseControl(event.target);
	if (closeControlRoot && closeControlRoot !== popoverRoot) {
		return true;
	}

	const related = event?.relatedTarget;

	if (isPopoverDismissIgnoredTarget(popoverRoot, related)) {
		return true;
	}

	if (!related) {
		const active = popoverRoot?.ownerDocument?.activeElement ?? null;

		return isPopoverDismissIgnoredTarget(popoverRoot, active);
	}

	return false;
}

/** True when a nested popover or modal should receive Escape / dismiss first. */
export function hasNestedOverlayOpenAsideFrom(
	popoverRoot: ?HTMLElement
): boolean {
	if (hasOpenModalOverlay()) {
		return true;
	}

	const popovers = document.querySelectorAll(POPOVER_ROOT_SELECTOR);

	for (let i = 0; i < popovers.length; i++) {
		const popover = popovers[i];
		if (popover instanceof HTMLElement && popover !== popoverRoot) {
			return true;
		}
	}

	return false;
}

function handlePopoverCloseGuardPointerDown(event: MouseEvent | TouchEvent) {
	const root = getPopoverRootFromCloseControl(event.target);
	if (root) {
		markPopoverClosing(root);
	}
}

if (typeof document !== 'undefined') {
	document.addEventListener(
		'mousedown',
		handlePopoverCloseGuardPointerDown,
		true
	);
	document.addEventListener(
		'touchstart',
		handlePopoverCloseGuardPointerDown,
		true
	);
}

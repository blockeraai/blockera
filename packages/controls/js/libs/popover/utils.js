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

export const VALUE_ADDON_POINTERS_SELECTOR =
	'.blockera-control.blockera-control-value-addon-pointers';

export const VARIABLE_PICKER_ITEM_SELECTOR =
	'.blockera-control-value-addon-popover-item, [data-test^="value-addon-picker-item-"]';

export const VARIABLE_PICKER_POPOVER_MARKER_SELECTOR =
	'[data-test="variable-picker-popover"], [data-cy="variable-picker-popover"]';

export function isElementInsideVariablePickerSelectionTarget(
	element: Element
): boolean {
	return Boolean(element.closest(VARIABLE_PICKER_ITEM_SELECTOR));
}

export function isVariablePickerSelectionInteraction(
	target: ?EventTarget
): boolean {
	if (!(target instanceof Element)) {
		return false;
	}

	return (
		isElementInsideVariablePickerSelectionTarget(target) ||
		isElementInsideVariablePickerPopover(target)
	);
}

export function isElementInsideVariablePickerPopover(
	element: Element
): boolean {
	return Boolean(element.closest(VARIABLE_PICKER_POPOVER_MARKER_SELECTOR));
}

function getVariablePickerPopoverRootFromTarget(target: Element): ?HTMLElement {
	const marker = target.closest(VARIABLE_PICKER_POPOVER_MARKER_SELECTOR);

	if (!(marker instanceof HTMLElement)) {
		return null;
	}

	return normalizePopoverRoot(getPopoverRoot(marker) ?? marker);
}

/**
 * Nested var-pickers may not share a direct parent link — never dismiss while
 * the user is selecting inside any open var-picker surface.
 */
function shouldIgnoreDismissForVariablePickerInteraction(
	popoverRoot: ?HTMLElement,
	target: Element
): boolean {
	if (isElementInsideVariablePickerSelectionTarget(target)) {
		return true;
	}

	if (!isElementInsideVariablePickerPopover(target)) {
		return false;
	}

	const varPickerRoot = getVariablePickerPopoverRootFromTarget(target);

	if (!(varPickerRoot instanceof HTMLElement)) {
		return true;
	}

	const normalizedRoot = normalizePopoverRoot(popoverRoot);

	if (!(normalizedRoot instanceof HTMLElement)) {
		return true;
	}

	if (isSamePopoverRoot(varPickerRoot, normalizedRoot)) {
		return true;
	}

	if (isPopoverNestedChildOf(varPickerRoot, normalizedRoot)) {
		return true;
	}

	// Nested var-picker without a registered parent link — still allow selection.
	return varPickerRoot !== normalizedRoot;
}

export function isElementInsideValueAddonPointers(element: Element): boolean {
	return Boolean(
		element.closest('.blockera-control-value-addon-pointers') ||
		element.closest('.blockera-control-value-addon-pointer') ||
		element.closest('[data-cy="value-addon-btn-open"]')
	);
}

function resolveOwningPopoverForFieldTarget(target: Element): ?HTMLElement {
	const pointersRoot = target.closest(
		'.blockera-control-value-addon-pointers'
	);
	const fieldScope =
		target.closest(POPOVER_ANCHOR_SCOPE_SELECTORS) ||
		(pointersRoot instanceof HTMLElement
			? pointersRoot.parentElement
			: null);

	if (!(fieldScope instanceof HTMLElement)) {
		return null;
	}

	const fromScope = fieldScope.closest(POPOVER_ROOT_SELECTOR);
	if (fromScope instanceof HTMLElement) {
		return normalizePopoverRoot(fromScope);
	}

	const popovers = document.querySelectorAll(POPOVER_ROOT_SELECTOR);

	for (let i = 0; i < popovers.length; i++) {
		const popover = popovers[i];
		if (popover instanceof HTMLElement && popover.contains(fieldScope)) {
			return normalizePopoverRoot(popover);
		}
	}

	return null;
}

/** True when two nodes refer to the same popover surface (including WP wrapper nesting). */
function isSamePopoverRoot(left: ?HTMLElement, right: ?HTMLElement): boolean {
	const normalizedLeft = normalizePopoverRoot(left);
	const normalizedRight = normalizePopoverRoot(right);

	if (
		!(normalizedLeft instanceof HTMLElement) ||
		!(normalizedRight instanceof HTMLElement)
	) {
		return normalizedLeft === normalizedRight;
	}

	if (normalizedLeft === normalizedRight) {
		return true;
	}

	return (
		normalizedLeft.contains(normalizedRight) ||
		normalizedRight.contains(normalizedLeft)
	);
}

/**
 * Value-addon pointers live in the parent field, not inside var-picker.
 * - Parent popover: ignore dismiss when owner matches this root.
 * - Var-picker (nested): owner is the parent — do not ignore (allow close).
 */
function shouldIgnoreDismissForValueAddonPointer(
	popoverRoot: ?HTMLElement,
	target: Element
): boolean {
	const owner = resolveOwningPopoverForFieldTarget(target);

	if (!owner) {
		return true;
	}

	const normalizedRoot = normalizePopoverRoot(popoverRoot);

	if (!(normalizedRoot instanceof HTMLElement)) {
		return false;
	}

	if (isSamePopoverRoot(owner, normalizedRoot)) {
		return true;
	}

	// Parent keeps open when owner resolves to a nested popover in its tree.
	if (isPopoverNestedChildOf(owner, normalizedRoot)) {
		return true;
	}

	return false;
}

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

export const SKETCH_PICKER_SELECTOR = '.sketch-picker';

let closingPopoverRoot: ?HTMLElement = null;
let sketchPickerInteractionPopoverRoot: ?HTMLElement = null;
let closingClearTimer: ?TimeoutID = null;
let lastPopoverPointerDownTarget: ?EventTarget = null;
let lastPopoverInteractionRoot: ?HTMLElement = null;
let modalOpenedFromPopoverRoot: ?HTMLElement = null;
const nestedPopoverParentByRoot: WeakMap<HTMLElement, HTMLElement> =
	new WeakMap();

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

/** Links a portaled child popover to the parent it was opened from. */
export function linkNestedPopoverToParent(
	nestedRoot: ?HTMLElement,
	parentRoot: ?HTMLElement
): void {
	const nested = normalizePopoverRoot(nestedRoot);
	const parent = normalizePopoverRoot(parentRoot);

	if (
		nested instanceof HTMLElement &&
		parent instanceof HTMLElement &&
		nested !== parent
	) {
		nestedPopoverParentByRoot.set(nested, parent);
	}
}

export function isPopoverNestedChildOf(
	nestedRoot: ?HTMLElement,
	ancestorRoot: ?HTMLElement
): boolean {
	const normalizedNested = normalizePopoverRoot(nestedRoot);
	const normalizedAncestor = normalizePopoverRoot(ancestorRoot);

	if (
		!(normalizedNested instanceof HTMLElement) ||
		!(normalizedAncestor instanceof HTMLElement)
	) {
		return false;
	}

	let current: ?HTMLElement = normalizedNested;

	while (current instanceof HTMLElement) {
		const parent = nestedPopoverParentByRoot.get(current);

		if (!(parent instanceof HTMLElement)) {
			return false;
		}

		if (parent === normalizedAncestor) {
			return true;
		}

		current = parent;
	}

	return false;
}

/** Called when a popover mounts; links it to the last in-popover interaction. */
export function registerPopoverOpen(popoverRoot: ?HTMLElement): void {
	const normalized = normalizePopoverRoot(popoverRoot);

	if (!(normalized instanceof HTMLElement)) {
		return;
	}

	let parentRoot = lastPopoverInteractionRoot;

	if (
		(!(parentRoot instanceof HTMLElement) || parentRoot === normalized) &&
		lastPopoverPointerDownTarget instanceof Element
	) {
		parentRoot = resolveOwningPopoverForFieldTarget(
			lastPopoverPointerDownTarget
		);
	}

	if (parentRoot instanceof HTMLElement && parentRoot !== normalized) {
		linkNestedPopoverToParent(normalized, parentRoot);
	}
}

export function unregisterPopoverRoot(popoverRoot: ?HTMLElement): void {
	const normalized = normalizePopoverRoot(popoverRoot);

	if (!(normalized instanceof HTMLElement)) {
		return;
	}

	nestedPopoverParentByRoot.delete(normalized);

	if (modalOpenedFromPopoverRoot === normalized) {
		modalOpenedFromPopoverRoot = null;
	}
}

function syncModalOpenedFromPopoverRoot(): void {
	if (hasOpenModalOverlay()) {
		if (lastPopoverInteractionRoot instanceof HTMLElement) {
			modalOpenedFromPopoverRoot = lastPopoverInteractionRoot;
		}

		return;
	}

	modalOpenedFromPopoverRoot = null;
}

function notePopoverPointerInteraction(target: ?EventTarget): void {
	const interactionRoot = getPopoverRoot(target);

	if (
		interactionRoot instanceof HTMLElement &&
		target instanceof Node &&
		interactionRoot.contains(target)
	) {
		lastPopoverInteractionRoot = interactionRoot;
	} else if (target instanceof Element) {
		if (isElementInsideValueAddonPointers(target)) {
			const owner = resolveOwningPopoverForFieldTarget(target);

			if (owner instanceof HTMLElement) {
				lastPopoverInteractionRoot = owner;
			}
		}

		const popoverFromTarget = target.closest(POPOVER_ROOT_SELECTOR);

		if (popoverFromTarget instanceof HTMLElement) {
			lastPopoverInteractionRoot = popoverFromTarget;
		} else if (
			!getPopoverRoot(target) &&
			!isElementInsideModalOverlay(target) &&
			!isElementInsideValueAddonPointers(target)
		) {
			lastPopoverInteractionRoot = null;
		}
	} else {
		lastPopoverInteractionRoot = null;
	}

	syncModalOpenedFromPopoverRoot();
}

function isModalInteractionIgnoredForPopover(
	popoverRoot: ?HTMLElement,
	target: ?EventTarget
): boolean {
	if (!(target instanceof Element)) {
		return false;
	}

	if (!isElementInsideModalOverlay(target)) {
		return false;
	}

	const normalizedRoot = normalizePopoverRoot(popoverRoot);

	if (!(normalizedRoot instanceof HTMLElement)) {
		return true;
	}

	if (!(modalOpenedFromPopoverRoot instanceof HTMLElement)) {
		return false;
	}

	return modalOpenedFromPopoverRoot === normalizedRoot;
}

/**
 * Whether a pointer/focus target should keep the popover open:
 * - inside the current popover
 * - inside a nested popover opened from this popover
 * - inside a modal opened from this popover
 * - inside value-addon pointer controls (variable / dynamic value openers)
 * - inside variable picker selection targets (nested var-picker support)
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

	if (!(target instanceof Element)) {
		return false;
	}

	if (shouldIgnoreDismissForVariablePickerInteraction(popoverRoot, target)) {
		return true;
	}

	if (isElementInsideValueAddonPointers(target)) {
		if (!(popoverRoot instanceof HTMLElement)) {
			return true;
		}

		return shouldIgnoreDismissForValueAddonPointer(popoverRoot, target);
	}

	if (isModalInteractionIgnoredForPopover(popoverRoot, target)) {
		return true;
	}

	const nestedPopover = getPopoverRoot(target);
	if (nestedPopover instanceof HTMLElement && nestedPopover !== popoverRoot) {
		return isPopoverNestedChildOf(nestedPopover, popoverRoot);
	}

	if (
		target instanceof HTMLElement &&
		target.closest('.components-dropdown__content')
	) {
		return true;
	}

	return false;
}

/**
 * True while the user is dragging inside a sketch-picker in this popover.
 */
export function isSketchPickerInteractionActiveFor(
	popoverRoot: ?HTMLElement
): boolean {
	return (
		sketchPickerInteractionPopoverRoot instanceof HTMLElement &&
		sketchPickerInteractionPopoverRoot === normalizePopoverRoot(popoverRoot)
	);
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

	if (isSketchPickerInteractionActiveFor(popoverRoot)) {
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
		// Cypress force clicks and some sidebar controls do not move focus, so
		// relatedTarget stays null while activeElement remains inside the popover.
		// Use the most recent pointer target to decide whether dismiss is intended.
		if (
			lastPopoverPointerDownTarget &&
			!isPopoverDismissIgnoredTarget(
				popoverRoot,
				lastPopoverPointerDownTarget
			)
		) {
			return false;
		}

		const active = popoverRoot?.ownerDocument?.activeElement ?? null;

		return isPopoverDismissIgnoredTarget(popoverRoot, active);
	}

	return false;
}

/** Whether a capture-phase pointer down outside the popover should dismiss it. */
export function shouldDismissPopoverFromPointerDown(
	popoverRoot: ?HTMLElement,
	target: ?EventTarget,
	anchor: ?HTMLElement
): boolean {
	if (!popoverRoot) {
		return false;
	}

	if (isOtherPopoverClosing(popoverRoot)) {
		return false;
	}

	if (anchor && target instanceof Node && anchor.contains(target)) {
		return false;
	}

	if (isSketchPickerInteractionActiveFor(popoverRoot)) {
		return false;
	}

	return !isPopoverDismissIgnoredTarget(popoverRoot, target);
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
	lastPopoverPointerDownTarget = event.target;
	notePopoverPointerInteraction(event.target);

	const root = getPopoverRootFromCloseControl(event.target);
	if (root) {
		markPopoverClosing(root);
	}
}

function handleSketchPickerInteractionStart(
	event: MouseEvent | PointerEvent | TouchEvent
) {
	if (!(event.target instanceof Element)) {
		return;
	}

	if (!event.target.closest(SKETCH_PICKER_SELECTOR)) {
		return;
	}

	sketchPickerInteractionPopoverRoot = getPopoverRoot(event.target);
}

function clearSketchPickerInteraction() {
	sketchPickerInteractionPopoverRoot = null;
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
	document.addEventListener(
		'pointerdown',
		handleSketchPickerInteractionStart,
		true
	);
	document.addEventListener(
		'mousedown',
		handleSketchPickerInteractionStart,
		true
	);
	document.addEventListener('pointerup', clearSketchPickerInteraction, true);
	document.addEventListener('mouseup', clearSketchPickerInteraction, true);
	document.addEventListener(
		'pointercancel',
		clearSketchPickerInteraction,
		true
	);
}

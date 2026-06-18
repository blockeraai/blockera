// @flow

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

			const focusOpener = scope.querySelector(
				'.is-focus, .is-open-popover'
			);

			if (focusOpener instanceof HTMLElement) {
				return focusOpener;
			}
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

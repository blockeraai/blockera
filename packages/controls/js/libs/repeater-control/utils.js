// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Children } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
	componentClassNames,
} from '@blockera/classnames';
import { convertDegToCharacter } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { CleanupRepeaterArgs } from './types';
import { extractNumberAndUnit } from '../input-control/utils';
import {
	getPopoverRoot,
	isElementInsideVariablePickerPopover,
	isElementInsideVariablePickerSelectionTarget,
	isPopoverDismissIgnoredTarget,
	INSPECTOR_SIDEBAR_SELECTORS,
	POPOVER_ROOT_SELECTOR,
} from '../popover/utils';

export const isOpenPopoverEvent = (
	event: Object,
	excludedTargetWrapper?: string
): boolean => {
	if (excludedTargetWrapper && event.target.closest(excludedTargetWrapper)) {
		return true;
	}

	return !['svg', 'button', 'path'].includes(event?.target?.tagName);
};

export function prepValueForHeader(value: any): MixedElement | string {
	if (value === '') {
		return '';
	}

	const extracted = extractNumberAndUnit(value);

	if (extracted?.specialUnit) {
		return <span className="unit-value unit-value-special">{value}</span>;
	}

	switch (extracted.unit) {
		case 'func':
			return <span className="unit-value unit-value-css">CSS</span>;

		case 'grad':
		case 'rad':
		case 'deg':
			return (
				<span className="unit-value">
					{convertDegToCharacter(value)}
				</span>
			);

		default:
			return <span className="unit-value">{value}</span>;
	}
}

export function getSortedRepeater(items: Object): Array<Object> {
	const dataArray = Object.entries(items);

	dataArray.sort(([, a], [, b]) => (a?.order || 0) - (b?.order || 0));

	return dataArray;
}

/**
 * Whether `itemId` is the first repeater row in display order (`item.order`),
 * same order as {@link getSortedRepeater} and MappedItems.
 */
export function isFirstRepeaterItem(itemId: string, items: Object): boolean {
	if (!items || typeof items !== 'object') {
		return false;
	}
	const sorted = getSortedRepeater(items);
	const first = sorted[0];
	return Boolean(first && first[0] === itemId);
}

export function getArialLabelSuffix(itemId: string): string | number {
	// Replace all '-' with a single space
	let result = itemId.replaceAll('-', ' ');

	// Replace multiple consecutive spaces with a single space
	result = result.replace(/\s+/g, ' ');

	// Trim the string from both sides
	result = result.trim();

	return result;
}

export function cleanupRepeaterItem(item: Object): Object {
	delete item?.isOpen;
	delete item?.display;
	delete item?.cloneable;
	delete item?.deletable;
	delete item?.hasVariations;

	if (!item?.selectable) {
		delete item?.isSelected;
	}

	delete item?.selectable;
	delete item?.visibilitySupport;

	return item;
}

export function cleanupRepeater(
	items: Object,
	args: CleanupRepeaterArgs = {}
): Object {
	const { callback } = args;
	let clonedItems = { ...items };

	clonedItems = Object.fromEntries(
		Object.entries(clonedItems).map(([itemId, item]): Object => {
			if ('function' === typeof callback) {
				return [itemId, callback(cleanupRepeaterItem(item))];
			}

			return [itemId, cleanupRepeaterItem(item)];
		})
	);

	return clonedItems;
}

export function isEnabledPromote(
	Promotion?: (items: Object) => MixedElement,
	items: Object
): boolean {
	return (
		'function' === typeof Promotion &&
		0 !== Children.count(Promotion({ items }))
	);
}

/**
 * Whether repeater promo UX (modal, guard, native styling, gated actions) is active.
 *
 * Aligns header guard and is-native presentation with PromoComponent and admin
 * disableProHints — e.g. when Blockera Pro nulls PromoComponent via props filter.
 *
 * @param {Function|void} Promotion PromoComponent render prop.
 * @param {Object} items Repeater items value.
 * @param {boolean} disableProHints Admin setting to hide pro hints.
 * @return {boolean} True when promo flow should run.
 */
export function isRepeaterPromoActive(
	Promotion?: (items: Object) => MixedElement,
	items: Object,
	disableProHints: boolean = false
): boolean {
	return !disableProHints && isEnabledPromote(Promotion, items);
}

/**
 * Whether a repeater row should use native promo styling (`is-native` class).
 *
 * @param {string} itemId Repeater item id.
 * @param {Object} item Repeater item value.
 * @param {Object} items Full repeater value.
 * @param {boolean} enablePromoCountOnRepeaterItemHeader Header promo flag.
 * @param {boolean} isPromoActive Whether repeater promo flow is active.
 * @return {boolean} True when row should use native styling.
 */
export function shouldApplyRepeaterItemNativeStyle(
	itemId: string,
	item: Object,
	items: Object,
	enablePromoCountOnRepeaterItemHeader: boolean,
	isPromoActive: boolean
): boolean {
	if (!isPromoActive) {
		return false;
	}

	return (
		true === item?.native ||
		(enablePromoCountOnRepeaterItemHeader &&
			!isFirstRepeaterItem(itemId, items) &&
			false !== item?.native)
	);
}

/**
 * Whether header/guard interactions should be gated behind promo for a row.
 *
 * @param {string} itemId Repeater item id.
 * @param {Object} item Repeater item value.
 * @param {Object} items Full repeater value.
 * @param {boolean} enablePromoCountOnRepeaterItemHeader Header promo flag.
 * @param {boolean} isPromoActive Whether repeater promo flow is active.
 * @return {boolean} True when promo should intercept header interactions.
 */
export function shouldGateRepeaterItemHeaderForPromo(
	itemId: string,
	item: Object,
	items: Object,
	enablePromoCountOnRepeaterItemHeader: boolean,
	isPromoActive: boolean
): boolean {
	if (
		applyFilters(
			'blockera.repeater.shouldGateRepeaterItemHeaderForPromo',
			false,
			{
				item,
				items,
				itemId,
				isPromoActive,
				enablePromoCountOnRepeaterItemHeader,
			}
		)
	) {
		return false;
	}

	if (!isPromoActive || false === item?.native) {
		return false;
	}

	if (!enablePromoCountOnRepeaterItemHeader) {
		return false;
	}

	if (isFirstRepeaterItem(itemId, items) && !item.hasOwnProperty('native')) {
		return false;
	}

	return true;
}

export const INSPECTOR_REPEATER_POPOVER_CLOSE_EVENT =
	'blockera/close-inspector-repeater-popovers';

const BLOCKERA_COMPONENT_POPOVER_CLASS = componentClassNames('popover')
	.split(/\s+/)
	.find((token) => token.includes('component-popover'));

function buildClassSelector(classNamesValue: string): string {
	return classNamesValue
		.split(/\s+/)
		.filter(Boolean)
		.map((token) => `.${token}`)
		.join('');
}

function getInspectorSidebars(doc: Document = document): Array<HTMLElement> {
	const sidebars: Array<HTMLElement> = [];

	INSPECTOR_SIDEBAR_SELECTORS.forEach((selector) => {
		doc.querySelectorAll(selector).forEach((node) => {
			if (node instanceof HTMLElement && !sidebars.includes(node)) {
				sidebars.push(node);
			}
		});
	});

	doc.querySelectorAll('.interface-complementary-area').forEach((node) => {
		if (node instanceof HTMLElement && !sidebars.includes(node)) {
			sidebars.push(node);
		}
	});

	return sidebars;
}

function getOpenRepeaterEditGroups(): Array<HTMLElement> {
	const repeaterItemSelector = `.${controlInnerClassNames('repeater-item')}`;
	const groupSelector = buildClassSelector(controlClassNames('group'));

	return Array.from(
		document.querySelectorAll(
			`${repeaterItemSelector} ${groupSelector}.is-open.mode-popover`
		)
	).filter((node) => node instanceof HTMLElement);
}

function findActiveRepeaterGroupEditPopoverRoots(
	sidebar: HTMLElement
): Array<HTMLElement> {
	if (getOpenRepeaterEditGroups().length === 0) {
		return [];
	}

	const doc = sidebar.ownerDocument;
	const groupPopoverSelector = `.${controlInnerClassNames('group-popover')}`;
	const roots: Array<HTMLElement> = [];

	doc.querySelectorAll(groupPopoverSelector).forEach((node) => {
		const root = getPopoverRoot(node);

		if (root instanceof HTMLElement && !roots.includes(root)) {
			roots.push(root);
		}
	});

	return roots;
}

/**
 * Generic WordPress portaled popovers (e.g. block state) should not suppress
 * selectable repeater activation while a repeater edit popover is open.
 */
function isUnrelatedInspectorPopover(
	target: EventTarget,
	editPopoverRoot: HTMLElement
): boolean {
	if (!(target instanceof Element)) {
		return false;
	}

	const targetPopover = getPopoverRoot(target);

	if (!(targetPopover instanceof HTMLElement)) {
		return false;
	}

	if (targetPopover === editPopoverRoot) {
		return false;
	}

	if (
		BLOCKERA_COMPONENT_POPOVER_CLASS &&
		targetPopover.classList.contains(BLOCKERA_COMPONENT_POPOVER_CLASS)
	) {
		return false;
	}

	return true;
}

function isTargetInsideRepeaterEditPopoverSurface(
	editPopoverRoot: HTMLElement,
	target: Element
): boolean {
	// Nested var-picker selections must not be blocked as in-edit-popover clicks.
	if (
		isElementInsideVariablePickerPopover(target) ||
		isElementInsideVariablePickerSelectionTarget(target)
	) {
		return false;
	}

	if (editPopoverRoot.contains(target)) {
		return true;
	}

	if (
		isPopoverDismissIgnoredTarget(editPopoverRoot, target) &&
		!isUnrelatedInspectorPopover(target, editPopoverRoot)
	) {
		return true;
	}

	return false;
}

/** Whether a pointer target is inside an open inspector edit popover surface. */
export function isClickInsideOpenInspectorRepeaterPopover(
	target: ?EventTarget
): boolean {
	if (!target || !(target instanceof Element)) {
		return false;
	}

	const doc = target.ownerDocument;

	for (const sidebar of getInspectorSidebars(doc)) {
		const editPopoverRoots =
			findActiveRepeaterGroupEditPopoverRoots(sidebar);

		if (editPopoverRoots.length === 0) {
			continue;
		}

		if (
			editPopoverRoots.some((editPopoverRoot) =>
				isTargetInsideRepeaterEditPopoverSurface(
					editPopoverRoot,
					target
				)
			)
		) {
			return true;
		}
	}

	return false;
}

/**
 * Whether this open repeater row should stay open while a nested repeater row
 * inside its edit popover is opening (nested repeaters portal row headers into
 * the parent popover body).
 */
export function shouldPreserveRepeaterPopoverForNestedOpen(
	itemRef: ?HTMLElement,
	openingFrom: ?HTMLElement
): boolean {
	if (
		!(itemRef instanceof HTMLElement) ||
		!(openingFrom instanceof HTMLElement)
	) {
		return false;
	}

	const groupSelector = buildClassSelector(controlClassNames('group'));
	const openGroup = itemRef.querySelector(
		`${groupSelector}.is-open.mode-popover`
	);

	if (!(openGroup instanceof HTMLElement)) {
		return false;
	}

	const groupPopoverClassTokens = controlInnerClassNames('group-popover')
		.split(/\s+/)
		.filter(Boolean);

	for (const node of document.querySelectorAll(POPOVER_ROOT_SELECTOR)) {
		if (!(node instanceof HTMLElement)) {
			continue;
		}

		if (
			!groupPopoverClassTokens.every((token) =>
				node.classList.contains(token)
			)
		) {
			continue;
		}

		if (node.contains(openingFrom)) {
			return true;
		}
	}

	return false;
}

/** Ask all repeater rows to close any open local edit popovers. */
export function closeInspectorRepeaterPopovers(
	openingFrom?: ?HTMLElement
): void {
	if (typeof document === 'undefined') {
		return;
	}

	document.dispatchEvent(
		new CustomEvent(INSPECTOR_REPEATER_POPOVER_CLOSE_EVENT, {
			detail: {
				openingFrom:
					openingFrom instanceof HTMLElement
						? openingFrom
						: undefined,
			},
		})
	);
}

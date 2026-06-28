// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Children } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { convertDegToCharacter } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { CleanupRepeaterArgs } from './types';
import { extractNumberAndUnit } from '../input-control/utils';

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

/** Ask all repeater rows to close any open local edit popovers. */
export function closeInspectorRepeaterPopovers(): void {
	if (typeof document === 'undefined') {
		return;
	}

	document.dispatchEvent(
		new CustomEvent(INSPECTOR_REPEATER_POPOVER_CLOSE_EVENT)
	);
}

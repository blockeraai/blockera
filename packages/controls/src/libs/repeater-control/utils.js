// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { convertDegToCharacter } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { CleanupRepeaterArgs } from './types';
import { extractNumberAndUnit } from '../input-control/utils';

export const isOpenPopoverEvent = (event: Object): boolean =>
	!['svg', 'button', 'path'].includes(event?.target?.tagName);

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

export function getArialLabelSuffix(itemId: string): string | number {
	return itemId.replaceAll('-', ' ');
}

export function cleanupRepeaterItem(item: Object): Object {
	delete item.isOpen;
	delete item.display;
	delete item.cloneable;
	delete item.deletable;
	delete item.isSelected;
	delete item.selectable;
	delete item.visibilitySupport;

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

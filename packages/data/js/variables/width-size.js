// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';

export const getWidthSizes: () => Array<VariableItem> | [] = memoize(
	function (): Array<VariableItem> | [] {
		const reference = {
			type: 'preset',
		};

		const layout = getBlockEditorSettings()?.__experimentalFeatures?.layout;

		if (isUndefined(layout)) {
			return [];
		}

		const items = [];

		if (!isUndefined(layout?.contentSize)) {
			items.push({
				name: __('Content Width', 'blockera'),
				id: 'contentSize',
				value: layout?.contentSize,
				reference,
			});
		}

		if (!isUndefined(layout?.wideSize)) {
			items.push({
				name: __('Site Wide Width', 'blockera'),
				id: 'wideSize',
				value: layout?.wideSize,
				reference,
			});
		}

		return items;
	}
);

export const getWidthSizesTitle: () => string = memoize(function (): string {
	const layout = getBlockEditorSettings()?.__experimentalFeatures?.layout;

	if (isUndefined(layout)) {
		return __('Editor Width & Height Sizes', 'blockera');
	}

	return __('Theme Width & Height Sizes', 'blockera');
});

export const getWidthSize: (id: string) => ?VariableItem = memoize(function (
	id: string
): ?VariableItem {
	let widthSize = getWidthSizes().find((item) => item.id === id);

	// If not, check if the color is in the custom colors
	if (isUndefined(widthSize?.value)) {
		const { getVariableGroupItems } = select(STORE_NAME);

		widthSize = getVariableGroupItems('', 'width-size').find(
			(item) => item.id === id
		);
	}

	return widthSize;
});

export const getWidthSizeBy: (field: string, value: any) => ?VariableItem =
	memoize(function (field: string, value: any): ?VariableItem {
		return getWidthSizes().find((item) => item[field] === value);
	});

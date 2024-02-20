// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { default as memoize } from 'fast-memoize';

/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
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
				name: __('Content Width', 'publisher-core'),
				id: 'contentSize',
				value: layout?.contentSize,
				reference,
			});
		}

		if (!isUndefined(layout?.wideSize)) {
			items.push({
				name: __('Site Wide Width', 'publisher-core'),
				id: 'wideSize',
				value: layout?.wideSize,
				reference,
			});
		}

		return items;
	}
);

export const getWidthSize: (id: string) => ?VariableItem = memoize(function (
	id: string
): ?VariableItem {
	return getWidthSizes().find((item) => item.id === id);
});

export const getWidthSizeBy: (field: string, value: any) => ?VariableItem =
	memoize(function (field: string, value: any): ?VariableItem {
		return getWidthSizes().find((item) => item[field] === value);
	});

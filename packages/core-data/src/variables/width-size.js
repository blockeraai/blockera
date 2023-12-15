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

const _getWidthSizes = function (): Array<VariableItem> {
	// todo improve this to support all states and be more safe
	const layout = getBlockEditorSettings()?.__experimentalFeatures?.layout;

	if (isUndefined(layout)) {
		return [];
	}

	const items = [];

	if (!isUndefined(layout?.contentSize)) {
		items.push({
			name: __('Content Width', 'publisher-core'),
			slug: 'contentSize',
			value: layout?.contentSize,
		});
	}

	if (!isUndefined(layout?.wideSize)) {
		items.push({
			name: __('Site Wide Width', 'publisher-core'),
			slug: 'wideSize',
			value: layout?.wideSize,
		});
	}

	return items;
};

const _getWidthSizesMemoized = memoize(_getWidthSizes);

export const getWidthSizes = (): Array<VariableItem> => {
	return _getWidthSizesMemoized();
};

const _getWidthSize = function (slug: string): VariableItem {
	return getWidthSizes().find((item) => item.slug === slug);
};

const _getWidthSizeMemoized = memoize(_getWidthSize);

export const getWidthSize = (slug: string): ?VariableItem => {
	return _getWidthSizeMemoized(slug);
};

const _getWidthSizeBy = function (field: string, value: any): ?VariableItem {
	return getWidthSizes().find((item) => item[field] === value);
};

const _getWidthSizeByMemoized = memoize(_getWidthSizeBy);

export const getWidthSizeBy = (field: string, value: any): ?VariableItem => {
	return _getWidthSizeByMemoized(field, value);
};

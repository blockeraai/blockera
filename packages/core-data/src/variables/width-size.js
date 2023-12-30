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

const _getWidthSizes = function (): Array<VariableItem> | [] {
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
};

const _getWidthSizesMemoized = memoize(_getWidthSizes);

export const getWidthSizes = (): Array<VariableItem> | [] => {
	return _getWidthSizesMemoized();
};

const _getWidthSize = function (id: string): ?VariableItem {
	return getWidthSizes().find((item) => item.id === id);
};

const _getWidthSizeMemoized = memoize(_getWidthSize);

export const getWidthSize = (id: string): ?VariableItem => {
	return _getWidthSizeMemoized(id);
};

const _getWidthSizeBy = function (field: string, value: any): ?VariableItem {
	return getWidthSizes().find((item) => item[field] === value);
};

const _getWidthSizeByMemoized = memoize(_getWidthSizeBy);

export const getWidthSizeBy = (field: string, value: any): ?VariableItem => {
	return _getWidthSizeByMemoized(field, value);
};

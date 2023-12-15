// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { DynamicValueItem, DynamicValueTypes } from './types';

const _getArchiveDVItems = function (): Array<DynamicValueItem> {
	return [
		{
			name: __('Archive Title', 'publisher-core'),
			id: 'archive-title',
			type: 'text',
			status: 'free',
			category: 'archive',
		},
		{
			name: __('Archive Desc', 'publisher-core'),
			id: 'archive-desc',
			type: 'text',
			status: 'soon',
			category: 'archive',
		},
		{
			name: __('Archive Link', 'publisher-core'),
			id: 'archive-link',
			type: 'link',
			status: 'soon',
			category: 'archive',
		},
		{
			name: __('Archive ID', 'publisher-core'),
			id: 'archive-id',
			type: 'id',
			status: 'soon',
			category: 'archive',
		},
		{
			name: __('Archive Meta', 'publisher-core'),
			id: 'archive-meta',
			type: 'meta',
			status: 'soon',
			category: 'archive',
		},
	];
};

// eslint-disable-next-line no-unused-vars
const _getArchiveDVItemsMemoized = memoize(_getArchiveDVItems);

export const getArchiveDynamicValueItems = (): Array<DynamicValueItem> => {
	return _getArchiveDVItemsMemoized();
};

const _getArchiveDVItem = function (id: string): ?DynamicValueItem {
	return getArchiveDynamicValueItems().find((item) => id === item?.id);
};

const _getArchiveDVItemMemoized = memoize(_getArchiveDVItem);

export const getArchiveDynamicValueItem = (
	types: string
): ?DynamicValueItem => {
	return _getArchiveDVItemMemoized(types);
};

const _getArchiveDVItemsBy = function (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
): ?Array<DynamicValueItem> | void {
	return getArchiveDynamicValueItems().filter((item) => {
		if (field === 'type') {
			if (value.includes('all')) {
				return getArchiveDynamicValueItems();
			}

			return value.includes(item.type);
		}

		return item[field] === value;
	});
};

const _getArchiveDVItemsByMemoized = memoize(_getArchiveDVItemsBy);

export const getArchiveDynamicValueItemsBy = (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
): Array<DynamicValueItem> | void => {
	return _getArchiveDVItemsByMemoized(field, value);
};

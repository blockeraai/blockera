// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { DynamicValueItem } from './types/dynamic-value-item';

const _getPostDynamicValueItems = function (): Array<DynamicValueItem> {
	return [
		{
			name: __('Post Title', 'publisher-core'),
			id: 'post-title',
			type: 'text',
			status: 'free',
		},
		{
			name: __('Post Excerpt', 'publisher-core'),
			id: 'post-excerpt',
			type: 'text',
			status: 'free',
		},
		{
			name: __('Post Content', 'publisher-core'),
			id: 'post-content',
			type: 'text',
			status: 'soon',
		},
		{
			name: __('Post ID', 'publisher-core'),
			id: 'post-id',
			type: 'id',
			status: 'soon',
		},
		{
			name: __('Post Link', 'publisher-core'),
			id: 'post-link',
			type: 'link',
			status: 'soon',
		},
		{
			name: __('Post Date', 'publisher-core'),
			id: 'post-date',
			type: 'date',
			status: 'soon',
		},
		{
			name: __('Post Time', 'publisher-core'),
			id: 'post-time',
			type: 'time',
			status: 'soon',
		},
		{
			name: __('Reading Time', 'publisher-core'),
			id: 'post-reading-time',
			type: 'time',
			status: 'soon',
		},
		{
			name: __('Post Meta', 'publisher-core'),
			id: 'post-meta',
			type: 'meta',
			status: 'soon',
		},
	];
};

// eslint-disable-next-line no-unused-vars
const _getPostDynamicValueItemsMemoized = memoize(_getPostDynamicValueItems);

export const getPostDynamicValueItems = (): Array<DynamicValueItem> => {
	return _getPostDynamicValueItemsMemoized();
};

const _getPostDynamicValueItem = function (
	id: Array<string>
): ?DynamicValueItem {
	return getPostDynamicValueItems().find((item) => id === item?.id);
};

const _getPostDynamicValueItemMemoized = memoize(_getPostDynamicValueItem);

export const getPostDynamicValueItem = (
	types: Array<string>
): ?DynamicValueItem => {
	return _getPostDynamicValueItemMemoized(types);
};

const _getPostDVItemsBy = function (
	field: string,
	value: string | Array<string>
): ?Array<DynamicValueItem> {
	return getPostDynamicValueItems().filter((item) => {
		if (field === 'type') {
			if (value.includes('all')) {
				return getPostDynamicValueItems();
			}

			return value.includes(item.type);
		}

		return item[field] === value;
	});
};

const _getPostDVItemsByMemoized = memoize(_getPostDVItemsBy);

export const getPostDynamicValueItemsBy = (
	field: string,
	value: string | Array<string>
): ?Array<DynamicValueItem> => {
	return _getPostDVItemsByMemoized(field, value);
};

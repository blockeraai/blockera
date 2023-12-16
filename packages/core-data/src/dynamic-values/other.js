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

const _getOtherDVItems = function (): Array<DynamicValueItem> {
	return [
		{
			name: __('Current Date', 'publisher-core'),
			id: 'date',
			type: 'date',
			status: 'free',
			category: 'other',
			reference: {
				type: 'core',
			},
		},
		{
			name: __('Shortcode', 'publisher-core'),
			id: 'shortcode',
			type: 'shortcode',
			status: 'soon',
			category: 'other',
			reference: {
				type: 'core',
			},
		},
		{
			name: __('Request Parameter', 'publisher-core'),
			id: 'request',
			type: 'text',
			status: 'soon',
			category: 'other',
			reference: {
				type: 'core',
			},
		},
	];
};

// eslint-disable-next-line no-unused-vars
const _getOtherDVItemsMemoized = memoize(_getOtherDVItems);

export const getOtherDynamicValueItems = (): Array<DynamicValueItem> => {
	return _getOtherDVItemsMemoized();
};

const _getOtherDVItem = function (id: string): ?DynamicValueItem {
	return getOtherDynamicValueItems().find((item) => id === item?.id);
};

const _getOtherDVItemMemoized = memoize(_getOtherDVItem);

export const getOtherDynamicValueItem = (types: string): ?DynamicValueItem => {
	return _getOtherDVItemMemoized(types);
};

const _getOtherDVItemsBy = function (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
): ?Array<DynamicValueItem> | void {
	return getOtherDynamicValueItems().filter((item) => {
		if (field === 'type') {
			if (value.includes('all')) {
				return getOtherDynamicValueItems();
			}

			return value.includes(item.type);
		}

		return item[field] === value;
	});
};

const _getOtherDVItemsByMemoized = memoize(_getOtherDVItemsBy);

export const getOtherDynamicValueItemsBy = (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
): Array<DynamicValueItem> | void => {
	return _getOtherDVItemsByMemoized(field, value);
};

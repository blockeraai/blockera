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

const _getFeaturedImageDynamicValueItems =
	function (): Array<DynamicValueItem> {
		return [
			{
				name: __('Image URL', 'publisher-core'),
				id: 'featured-image-url',
				type: 'image',
				status: 'core',
				category: 'featured-image',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('Image ID', 'publisher-core'),
				id: 'featured-image-id',
				type: 'id',
				status: 'soon',
				category: 'featured-image',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Image Title', 'publisher-core'),
				id: 'featured-image-title',
				type: 'text',
				status: 'soon',
				category: 'featured-image',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Image Alt', 'publisher-core'),
				id: 'featured-image-alt',
				type: 'text',
				status: 'soon',
				category: 'featured-image',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Image Caption', 'publisher-core'),
				id: 'featured-image-caption',
				type: 'text',
				status: 'soon',
				category: 'featured-image',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Image Desc', 'publisher-core'),
				id: 'featured-image-desc',
				type: 'text',
				status: 'soon',
				category: 'featured-image',
				reference: {
					type: 'core-pro',
				},
			},
		];
	};

// eslint-disable-next-line no-unused-vars
const _getFeaturedImageDynamicValueItemsMemoized = memoize(
	_getFeaturedImageDynamicValueItems
);

export const getFeaturedImageDynamicValueItems =
	(): Array<DynamicValueItem> => {
		return _getFeaturedImageDynamicValueItemsMemoized();
	};

const _getFeaturedImageDVItem = function (id: string): ?DynamicValueItem {
	return getFeaturedImageDynamicValueItems().find((item) => id === item?.id);
};

const _getFeaturedImageDVItemMemoized = memoize(_getFeaturedImageDVItem);

export const getFeaturedImageDynamicValueItem = (
	types: string
): ?DynamicValueItem => {
	return _getFeaturedImageDVItemMemoized(types);
};

const _getFeaturedImageDVItemsBy = function (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
): Array<DynamicValueItem> {
	return getFeaturedImageDynamicValueItems().filter((item) => {
		if (field === 'type') {
			if (value.includes('all')) {
				return getFeaturedImageDynamicValueItems();
			}

			return value.includes(item.type);
		}

		return item[field] === value;
	});
};

const _getFeaturedImageDVItemsByMemoized = memoize(_getFeaturedImageDVItemsBy);

export const getFeaturedImageDynamicValueItemsBy = (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
): Array<DynamicValueItem> => {
	return _getFeaturedImageDVItemsByMemoized(field, value);
};

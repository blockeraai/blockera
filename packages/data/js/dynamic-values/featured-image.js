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

export const getFeaturedImageDynamicValueItems: () => Array<DynamicValueItem> =
	memoize(function (): Array<DynamicValueItem> {
		return [
			{
				name: __('Image URL', 'blockera'),
				id: 'featured-image-url',
				type: 'image',
				status: 'core',
				category: 'featured-image',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('Image ID', 'blockera'),
				id: 'featured-image-id',
				type: 'id',
				status: 'soon',
				category: 'featured-image',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Image Title', 'blockera'),
				id: 'featured-image-title',
				type: 'text',
				status: 'soon',
				category: 'featured-image',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Image Alt', 'blockera'),
				id: 'featured-image-alt',
				type: 'text',
				status: 'soon',
				category: 'featured-image',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Image Caption', 'blockera'),
				id: 'featured-image-caption',
				type: 'text',
				status: 'soon',
				category: 'featured-image',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Image Desc', 'blockera'),
				id: 'featured-image-desc',
				type: 'text',
				status: 'soon',
				category: 'featured-image',
				reference: {
					type: 'core-pro',
				},
			},
		];
	});

export const getFeaturedImageDynamicValueItem: (
	types: string
) => ?DynamicValueItem = memoize(function (id: string): ?DynamicValueItem {
	return getFeaturedImageDynamicValueItems().find((item) => id === item?.id);
});

export const getFeaturedImageDynamicValueItemsBy: (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
) => Array<DynamicValueItem> = memoize(function (
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
});

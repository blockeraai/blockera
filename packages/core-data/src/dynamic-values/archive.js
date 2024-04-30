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

export const getArchiveDynamicValueItems: () => Array<DynamicValueItem> =
	memoize(function (): Array<DynamicValueItem> {
		return [
			{
				name: __('Archive Title', 'blockera'),
				id: 'archive-title',
				type: 'text',
				status: 'core',
				category: 'archive',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('Archive Desc', 'blockera'),
				id: 'archive-desc',
				type: 'text',
				status: 'soon',
				category: 'archive',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Archive Link', 'blockera'),
				id: 'archive-link',
				type: 'link',
				status: 'soon',
				category: 'archive',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Archive ID', 'blockera'),
				id: 'archive-id',
				type: 'id',
				status: 'soon',
				category: 'archive',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Archive Meta', 'blockera'),
				id: 'archive-meta',
				type: 'meta',
				status: 'soon',
				category: 'archive',
				reference: {
					type: 'core-pro',
				},
			},
		];
	});

export const getArchiveDynamicValueItem: (types: string) => ?DynamicValueItem =
	memoize(function (id: string): ?DynamicValueItem {
		return getArchiveDynamicValueItems().find((item) => id === item?.id);
	});

export const getArchiveDynamicValueItemsBy: (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
) => Array<DynamicValueItem> = memoize(function (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
): ?Array<DynamicValueItem> {
	return getArchiveDynamicValueItems().filter((item) => {
		if (field === 'type') {
			if (value.includes('all')) {
				return getArchiveDynamicValueItems();
			}

			return value.includes(item.type);
		}

		return item[field] === value;
	});
});

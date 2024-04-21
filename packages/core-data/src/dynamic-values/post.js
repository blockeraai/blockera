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

export const getPostDynamicValueItems: () => Array<DynamicValueItem> = memoize(
	function (): Array<DynamicValueItem> {
		return [
			{
				name: __('Post Title', 'blockera-core'),
				id: 'post-title',
				type: 'text',
				status: 'core',
				category: 'post',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('Post Excerpt', 'blockera-core'),
				id: 'post-excerpt',
				type: 'text',
				status: 'core',
				category: 'post',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('Post Content', 'blockera-core'),
				id: 'post-content',
				type: 'text',
				status: 'soon',
				category: 'post',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Post ID', 'blockera-core'),
				id: 'post-id',
				type: 'id',
				status: 'core',
				category: 'post',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('Post Link', 'blockera-core'),
				id: 'post-link',
				type: 'link',
				status: 'soon',
				category: 'post',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Post Date', 'blockera-core'),
				id: 'post-date',
				type: 'date',
				status: 'soon',
				category: 'post',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Post Time', 'blockera-core'),
				id: 'post-time',
				type: 'time',
				status: 'soon',
				category: 'post',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Reading Time', 'blockera-core'),
				id: 'post-reading-time',
				type: 'time',
				status: 'soon',
				category: 'post',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Post Categories', 'blockera-core'),
				id: 'post-cats',
				type: 'category',
				status: 'soon',
				category: 'post',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Post Tags', 'blockera-core'),
				id: 'post-tags',
				type: 'tag',
				status: 'soon',
				category: 'post',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Post Terms', 'blockera-core'),
				id: 'post-terms',
				type: 'term',
				status: 'soon',
				category: 'post',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Post Comments', 'blockera-core'),
				id: 'post-comments',
				type: 'comment',
				status: 'soon',
				category: 'post',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Post Meta', 'blockera-core'),
				id: 'post-meta',
				type: 'meta',
				status: 'soon',
				category: 'post',
				reference: {
					type: 'core-pro',
				},
			},
		];
	}
);

export const getPostDynamicValueItem: (types: string) => ?DynamicValueItem =
	memoize(function (id: string): ?DynamicValueItem {
		return getPostDynamicValueItems().find((item) => id === item?.id);
	});

export const getPostDynamicValueItemsBy: (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
) => Array<DynamicValueItem> = memoize(function (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
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
});

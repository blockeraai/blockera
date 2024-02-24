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

export const getSiteDynamicValueItems: () => Array<DynamicValueItem> = memoize(
	function (): Array<DynamicValueItem> {
		return [
			{
				name: __('Site Title', 'publisher-core'),
				id: 'site-title',
				type: 'text',
				status: 'core',
				category: 'site',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('Site Tagline', 'publisher-core'),
				id: 'site-desc',
				type: 'text',
				status: 'core',
				category: 'site',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('Home URL', 'publisher-core'),
				id: 'home-url',
				type: 'link',
				status: 'core',
				category: 'site',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('Site URL', 'publisher-core'),
				id: 'site-url',
				type: 'link',
				status: 'core',
				category: 'site',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('Site Logo URL', 'publisher-core'),
				id: 'site-logo',
				type: 'image',
				status: 'soon',
				category: 'site',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Admin Email', 'publisher-core'),
				id: 'site-admin-email',
				type: 'email',
				status: 'soon',
				category: 'site',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('RSS URL', 'publisher-core'),
				id: 'site-rss',
				type: 'link',
				status: 'soon',
				category: 'site',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Login URL', 'publisher-core'),
				id: 'site-login',
				type: 'link',
				status: 'soon',
				category: 'site',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Logout URL', 'publisher-core'),
				id: 'site-logout',
				type: 'link',
				status: 'soon',
				category: 'site',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('Site Meta', 'publisher-core'),
				id: 'site-meta',
				type: 'meta',
				status: 'soon',
				category: 'site',
				reference: {
					type: 'core-pro',
				},
			},
		];
	}
);

export const getSiteDynamicValueItem: (types: string) => ?DynamicValueItem =
	memoize(function (id: string): ?DynamicValueItem {
		return getSiteDynamicValueItems().find((item) => id === item?.id);
	});

export const getSiteDynamicValueItemsBy: (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
) => Array<DynamicValueItem> = memoize(function (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
): ?Array<DynamicValueItem> {
	return getSiteDynamicValueItems().filter((item) => {
		if (field === 'type') {
			if (value.includes('all')) {
				return getSiteDynamicValueItems();
			}

			return value.includes(item.type);
		}

		return item[field] === value;
	});
});

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

export const getUserDynamicValueItems: () => Array<DynamicValueItem> = memoize(
	function (): Array<DynamicValueItem> {
		return [
			{
				name: __('User Display Name', 'publisher-core'),
				id: 'user-display-name',
				type: 'text',
				status: 'core',
				category: 'user',
				reference: {
					type: 'core',
				},
			},
			{
				name: __('User First Name', 'publisher-core'),
				id: 'user-first-name',
				type: 'text',
				status: 'soon',
				category: 'user',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('User Last Name', 'publisher-core'),
				id: 'user-last-name',
				type: 'text',
				status: 'soon',
				category: 'user',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('User Username', 'publisher-core'),
				id: 'user-username',
				type: 'text',
				status: 'soon',
				category: 'user',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('User Biography', 'publisher-core'),
				id: 'user-biography',
				type: 'text',
				status: 'soon',
				category: 'user',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('User Email', 'publisher-core'),
				id: 'user-email',
				type: 'email',
				status: 'soon',
				category: 'user',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('User Website', 'publisher-core'),
				id: 'user-website',
				type: 'link',
				status: 'soon',
				category: 'user',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('User ID', 'publisher-core'),
				id: 'user-id',
				type: 'id',
				status: 'soon',
				category: 'user',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('User Avatar URL', 'publisher-core'),
				id: 'user-avatar-url',
				type: 'image',
				status: 'soon',
				category: 'user',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('User Profile URL', 'publisher-core'),
				id: 'user-profile-url',
				type: 'link',
				status: 'soon',
				category: 'user',
				reference: {
					type: 'core-pro',
				},
			},
			{
				name: __('User Meta', 'publisher-core'),
				id: 'user-meta',
				type: 'meta',
				status: 'soon',
				category: 'user',
				reference: {
					type: 'core-pro',
				},
			},
		];
	}
);

export const getUserDynamicValueItem: (types: string) => ?DynamicValueItem =
	memoize(function (id: string): ?DynamicValueItem {
		return getUserDynamicValueItems().find((item) => id === item?.id);
	});

export const getUserDynamicValueItemsBy: (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
) => Array<DynamicValueItem> = memoize(function (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
): ?Array<DynamicValueItem> {
	return getUserDynamicValueItems().filter((item) => {
		if (field === 'type') {
			if (value.includes('all')) {
				return getUserDynamicValueItems();
			}

			return value.includes(item.type);
		}

		return item[field] === value;
	});
});

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

export const getOtherDynamicValueItems: () => Array<DynamicValueItem> = memoize(
	function (): Array<DynamicValueItem> {
		return [
			{
				name: __('Current Date', 'publisher-core'),
				id: 'date',
				type: 'date',
				status: 'core',
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
	}
);

export const getOtherDynamicValueItem: (types: string) => ?DynamicValueItem =
	memoize(function (id: string): ?DynamicValueItem {
		return getOtherDynamicValueItems().find((item) => id === item?.id);
	});

export const getOtherDynamicValueItemsBy: (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
) => Array<DynamicValueItem> = memoize(function (
	field: string,
	value: DynamicValueTypes | Array<DynamicValueTypes>
): ?Array<DynamicValueItem> {
	return getOtherDynamicValueItems().filter((item) => {
		if (field === 'type') {
			if (value.includes('all')) {
				return getOtherDynamicValueItems();
			}

			return value.includes(item.type);
		}

		return item[field] === value;
	});
});

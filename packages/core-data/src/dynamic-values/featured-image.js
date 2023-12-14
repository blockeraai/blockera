// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { __ } from '@wordpress/i18n';

const _getFeaturedImageDynamicValueItems = function (): Array<{
	name: string,
	id: string,
	type: string,
}> {
	return [
		{
			name: __('Image Title', 'publisher-core'),
			id: 'featured-image-title',
			type: 'text',
		},
		{
			name: __('Image Alt', 'publisher-core'),
			id: 'featured-image-alt',
			type: 'text',
		},
		{
			name: __('Image Caption', 'publisher-core'),
			id: 'featured-image-caption',
			type: 'text',
		},
		{
			name: __('Image Desc', 'publisher-core'),
			id: 'featured-image-desc',
			type: 'text',
		},
		{
			name: __('Image ID', 'publisher-core'),
			id: 'featured-image-id',
			type: 'id',
		},
		{
			name: __('Image URL', 'publisher-core'),
			id: 'featured-image-url',
			type: 'image',
		},
	];
};

// eslint-disable-next-line no-unused-vars
const _getFeaturedImageDynamicValueItemsMemoized = memoize(
	_getFeaturedImageDynamicValueItems
);

export const getFeaturedImageDynamicValueItems = (): Array<{
	name: string,
	id: string,
	type: string,
}> => {
	return _getFeaturedImageDynamicValueItemsMemoized();
};

const _getFeaturedImageDVItem = function (id: Array<string>): ?{
	name: string,
	id: string,
	type: string,
} {
	return getFeaturedImageDynamicValueItems().find((item) => id === item?.id);
};

const _getFeaturedImageDVItemMemoized = memoize(_getFeaturedImageDVItem);

export const getFeaturedImageDynamicValueItem = (
	types: Array<string>
): ?{
	name: string,
	id: string,
	type: string,
} => {
	return _getFeaturedImageDVItemMemoized(types);
};

const _getFeaturedImageDVItemsBy = function (
	field: string,
	value: string | Array<string>
): ?Array<{
	name: string,
	id: string,
	type: string,
}> {
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
	value: string | Array<string>
): ?Array<{
	name: string,
	id: string,
	type: string,
}> => {
	return _getFeaturedImageDVItemsByMemoized(field, value);
};

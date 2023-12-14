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

const _getFeaturedImageDynamicValueItem = function (
	types: Array<string>
): ?Array<{
	name: string,
	id: string,
	type: string,
}> {
	return _getFeaturedImageDynamicValueItems().filter((item) =>
		types.includes(item.type)
	);
};

const _getFeaturedImageDynamicValueItemMemoized = memoize(
	_getFeaturedImageDynamicValueItem
);

export const getFeaturedImageDynamicValueItem = (
	types: Array<string>
): ?Array<{
	name: string,
	id: string,
	type: string,
}> => {
	return _getFeaturedImageDynamicValueItemMemoized(types);
};

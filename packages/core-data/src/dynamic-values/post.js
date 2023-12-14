// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { __ } from '@wordpress/i18n';

const _getPostDynamicValueItems = function (): Array<{
	name: string,
	id: string,
	type: string,
}> {
	return [
		{
			name: __('Post Title', 'publisher-core'),
			id: 'post-title',
			type: 'text',
		},
		{
			name: __('Post Excerpt', 'publisher-core'),
			id: 'post-excerpt',
			type: 'text',
		},
		{
			name: __('Post Content', 'publisher-core'),
			id: 'post-content',
			type: 'text',
		},
		{
			name: __('Post ID', 'publisher-core'),
			id: 'post-id',
			type: 'id',
		},
		{
			name: __('Post Link', 'publisher-core'),
			id: 'post-link',
			type: 'link',
		},
		{
			name: __('Post Date', 'publisher-core'),
			id: 'post-date',
			type: 'date',
		},
		{
			name: __('Post Time', 'publisher-core'),
			id: 'post-time',
			type: 'time',
		},
		{
			name: __('Reading Time', 'publisher-core'),
			id: 'post-reading-time',
			type: 'time',
		},
		{
			name: __('Post Meta', 'publisher-core'),
			id: 'post-meta',
			type: 'meta',
		},
	];
};

// eslint-disable-next-line no-unused-vars
const _getPostDynamicValueItemsMemoized = memoize(_getPostDynamicValueItems);

export const getPostDynamicValueItems = (): Array<{
	name: string,
	id: string,
	type: string,
}> => {
	return _getPostDynamicValueItemsMemoized();
};

const _getPostDynamicValueItem = function (types: Array<string>): ?Array<{
	name: string,
	id: string,
	type: string,
}> {
	return getPostDynamicValueItems().filter((item) =>
		types.includes(item.type)
	);
};

const _getPostDynamicValueItemMemoized = memoize(_getPostDynamicValueItem);

export const getPostDynamicValueItem = (
	types: Array<string>
): ?Array<{
	name: string,
	id: string,
	type: string,
}> => {
	return _getPostDynamicValueItemMemoized(types);
};

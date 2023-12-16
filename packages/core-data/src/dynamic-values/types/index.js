// @flow
/**
 * Internal dependencies
 */
import type { ValueAddonReference, ValueAddonItemStatus } from '../../types';

export type DynamicValueCategory =
	| 'post'
	| 'featured-image'
	| 'archive'
	| 'user'
	| 'other'
	| 'site';

export type DynamicValueTypes =
	| 'text'
	| 'link'
	| 'image'
	| 'id'
	| 'date'
	| 'meta'
	| 'email'
	| 'shortcode'
	| 'category'
	| 'tag'
	| 'term'
	| 'comment'
	| 'time';

export type DynamicValueItem = {
	name: string,
	id: string,
	type: DynamicValueTypes,
	status: ValueAddonItemStatus,
	category: DynamicValueCategory,
	reference: ValueAddonReference,
};

// @flow

export type DynamicValueItemStatus = 'soon' | 'free' | 'pro' | 'active';

export type DynamicValueCategory = 'post' | 'image';

export type DynamicValueTypes =
	| 'text'
	| 'link'
	| 'image'
	| 'id'
	| 'date'
	| 'meta'
	| 'time';

export type DynamicValueItem = {
	name: string,
	id: string,
	type: DynamicValueTypes,
	status: DynamicValueItemStatus,
	category: DynamicValueCategory,
};

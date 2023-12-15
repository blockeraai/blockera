// @flow
/**
 * Internal dependencies
 */
import type {
	AddonTypesItem,
	DynamicValueTypes,
	VariableTypes,
} from './use-value-addon-props';

export type ValueAddon = {
	id: string,
	settings: {
		...Object,
		var?: string,
		slug?: string,
		type: VariableTypes | DynamicValueTypes,
		reference?: 'preset' | 'custom',
		prepend?: string,
		append?: string,
		limit?: string,
	},
	valueType?: AddonTypesItem,
	isValueAddon: boolean,
};

export type VariableItem = {
	name: string,
	slug: string,
	value: string,
};

export type VariableItems = {
	name: string,
	variables: Array<VariableItem>,
	notFound?: boolean,
};

export type DynamicValueItem = {
	name: string,
	id: string,
	type: DynamicValueTypes,
	status?: 'soon' | 'free' | 'pro',
};

export type DynamicValueItems = {
	name: string,
	items: Array<DynamicValueItem>,
	notFound?: boolean,
};

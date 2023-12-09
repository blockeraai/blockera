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
		type: VariableTypes | DynamicValueTypes,
		reference?: 'preset' | 'custom',
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
};

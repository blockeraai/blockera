// @flow

/**
 * Publisher dependencies
 */
import type {
	VariableItem,
	VariableCategory,
	DynamicValueItem,
	DynamicValueCategory,
} from '@publisher/core-data';

/**
 * Internal dependencies
 */
import type { AddonTypesItem } from './use-value-addon-props';

export type ValueAddon = {
	id: string,
	settings: {
		...Object,
		var?: string,
		slug?: string,
		type: VariableCategory | DynamicValueCategory,
		reference?: 'preset' | 'custom',
		prepend?: string,
		append?: string,
		limit?: string,
	},
	valueType?: AddonTypesItem,
	isValueAddon: boolean,
};

export type VariableCategoryDetail = {
	name?: string,
	variables?: Array<VariableItem> | void,
	notFound?: boolean,
};

export type DynamicValueCategoryDetail = {
	name?: DynamicValueCategory | '',
	items?: Array<DynamicValueItem> | void,
	notFound?: boolean,
};

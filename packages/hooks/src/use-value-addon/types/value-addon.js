// @flow

/**
 * Publisher dependencies
 */
import type {
	VariableItem,
	VariableCategory,
	DynamicValueItem,
	DynamicValueCategory,
	ValueAddonReferenceType,
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
		reference?: ValueAddonReferenceType,
		prepend?: string,
		append?: string,
		limit?: string,
	},
	valueType?: AddonTypesItem,
	isValueAddon: boolean,
};

export type VariableCategoryDetail = {
	name?: string,
	variables: Array<VariableItem> | [],
	notFound?: boolean,
};

export type DynamicValueCategoryDetail = {
	name?: DynamicValueCategory | '',
	items: Array<DynamicValueItem> | [],
	notFound?: boolean,
};

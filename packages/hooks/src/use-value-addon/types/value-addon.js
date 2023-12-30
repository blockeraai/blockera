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
	name: string,
	settings: {
		...Object,
		var?: string,
		name?: string,
		id?: string,
		label: string,
		group: string,
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
	label?: string,
	items: Array<VariableItem> | [],
	notFound?: boolean,
};

export type DynamicValueCategoryDetail = {
	label?: DynamicValueCategory | '',
	items: Array<DynamicValueItem> | [],
	notFound?: boolean,
};

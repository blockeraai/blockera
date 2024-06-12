// @flow

/**
 * Blockera dependencies
 */
import type {
	VariableItem,
	VariableCategory,
	ValueAddonReferenceType,
} from '@blockera/data';

/**
 * Internal dependencies
 */
import type { AddonTypesItem } from './use-value-addon-props';

export type ValueAddon = {
	id?: string,
	name?: string,
	settings: {
		...Object,
		var?: string,
		name?: string,
		id?: string,
		label: string,
		group: string,
		type: VariableCategory,
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

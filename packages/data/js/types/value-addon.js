// @flow

/**
 * Internal dependencies
 */
import type { ValueAddonReference } from './general-types';
import type { VariableCategory } from '../variables/types';

/**
 * Value-addon object shape produced and consumed by `@blockera/data` variable helpers.
 * Controls re-exports an equivalent type for UI; keep fields aligned when extending.
 */
export type ValueAddon = {
	id?: string,
	name?: string,
	settings: {
		...Object,
		var?: string,
		name?: string,
		id?: string,
		label?: string,
		group?: string,
		type?: VariableCategory,
		reference?: ValueAddonReference,
		value?: mixed,
		prepend?: string,
		append?: string,
		limit?: string,
	},
	valueType?: string,
	isValueAddon: boolean,
};

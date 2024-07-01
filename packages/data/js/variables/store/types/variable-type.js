// @flow

/**
 * Internal dependencies
 */
import type { VariableItem, VariableCategory } from '../../types';

export type DynamicVariableType = {
	var: string,
	label: string,
	group: string,
	...VariableItem,
	type: VariableCategory,
};

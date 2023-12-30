// @flow
/**
 * Internal dependencies
 */
import type { VariableCategory } from '../../types';
import type { DynamicVariableType } from './variable-type';

export * from './variable-type';

export type DynamicVariableGroup = {
	label: string,
	type: VariableCategory,
	items: Array<DynamicVariableType>,
};

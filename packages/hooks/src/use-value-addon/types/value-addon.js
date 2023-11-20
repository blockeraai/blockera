// @flow
/**
 * Internal dependencies
 */
import type { AddonTypesItem } from './use-value-addon-props';
import type { VariableTypes } from '../components/pointer/types';

export type ValueAddon = {
	id: string,
	settings: {
		...Object,
		var?: string,
		valueType: AddonTypesItem,
		reference?: 'preset' | 'custom',
	},
	type?: VariableTypes,
	isValueAddon: boolean,
};

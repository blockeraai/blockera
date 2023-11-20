// @flow
/**
 * Internal dependencies
 */
import type { AddonTypesItem } from './use-value-addon-props';
import type { VariableTypes } from '../components/pointer/types';

export type ValueAddon = {
	id: string,
	var?: string,
	settings: Object,
	type?: VariableTypes,
	isValueAddon: boolean,
	valueType: AddonTypesItem,
	reference?: 'preset' | 'custom',
};

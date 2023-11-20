// @flow
/**
 * Internal dependencies
 */
import type { VariableTypes } from '../components/pointer/types';
import type { ValueAddon } from './value-addon';

export type AddonTypesItem = 'variable' | 'dynamic-value';
export type AddonTypes = Array<AddonTypesItem>;

export type UseValueAddonProps = {
	types: AddonTypes,
	value: any,
	onChange: (value: ValueAddon) => void,
	variableType: VariableTypes,
	//FIXME: please fix all available dynamic value types!
	dynamicValueType: 'TEXT' | 'MEDIA',
};

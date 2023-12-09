// @flow
/**
 * Internal dependencies
 */
import type { ValueAddon } from './value-addon';

export type AddonTypesItem = 'variable' | 'dynamic-value';
export type AddonTypes = Array<AddonTypesItem>;

export type UseValueAddonProps = {
	types: AddonTypes,
	value: any,
	onChange: (value: string | ValueAddon) => void,
	variableTypes: Array<VariableTypes>,
	dynamicValueTypes: Array<DynamicValueTypes>,
};

export type VariableTypes = 'FONT_SIZE' | 'GRADIENT';
export type DynamicValueTypes = 'TEXT' | 'MEDIA';

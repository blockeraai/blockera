// @flow
/**
 * Publisher dependencies
 */
import type { DynamicValueTypes, VariableCategory } from '@publisher/core-data';

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
	variableTypes: Array<VariableCategory>,
	dynamicValueTypes: Array<DynamicValueTypes>,
};

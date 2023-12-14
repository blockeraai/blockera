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

export type VariableTypes =
	| 'font-size'
	| 'linear-gradient'
	| 'radial-gradient'
	| 'spacing'
	| 'width-size'
	| 'theme-color';

export type DynamicValueTypes =
	| 'text'
	| 'link'
	| 'image'
	| 'id'
	| 'date'
	| 'meta'
	| 'time';

export type DynamicValueCategories = 'post' | 'featured-image';

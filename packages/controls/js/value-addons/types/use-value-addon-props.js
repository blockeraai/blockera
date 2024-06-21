// @flow
/**
 * Blockera dependencies
 */
import type { DynamicValueTypes, VariableCategory } from '@blockera/data';

/**
 * Internal dependencies
 */
import type { ControlSize } from '../../';
import type { ValueAddon } from './value-addon';

export type AddonTypesItem = 'variable' | 'dynamic-value';

export type AddonTypes = Array<AddonTypesItem>;

export type UseValueAddonProps = {
	value: any,
	types?: AddonTypes,
	size?: ControlSize,
	pickerProps?: Object,
	pointerProps?: Object,
	setValue: (newValue: any) => void,
	variableTypes?: Array<VariableCategory>,
	dynamicValueTypes: Array<DynamicValueTypes>,
	onChange: (value: string | ValueAddon) => void,
};

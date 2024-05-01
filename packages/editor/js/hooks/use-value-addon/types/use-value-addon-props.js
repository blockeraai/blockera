// @flow
/**
 * Blockera dependencies
 */
import type { DynamicValueTypes, VariableCategory } from '@blockera/data';
import type { ControlSize } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { ValueAddon } from './value-addon';

export type AddonTypesItem = 'variable' | 'dynamic-value';

export type AddonTypes = Array<AddonTypesItem>;

export type UseValueAddonProps = {
	types: AddonTypes,
	value: any,
	setValue: (newValue: any) => void,
	onChange: (value: string | ValueAddon) => void,
	variableTypes: Array<VariableCategory>,
	dynamicValueTypes: Array<DynamicValueTypes>,
	size: ControlSize,
	pointerProps: Object,
	pickerProps: Object,
};

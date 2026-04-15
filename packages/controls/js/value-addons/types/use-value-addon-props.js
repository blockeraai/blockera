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

export type PresetInterface = {
	variableTypes?: Array<VariableCategory | string>,
	unitType?: string,
	id?: string,
	singularId?: string | number,
};

export type UseValueAddonProps = {
	value: any,
	types?: AddonTypes,
	size?: ControlSize,
	pickerProps?: Object,
	pointerProps?: Object,
	/**
	 * When set (e.g. from InputControl for `spacing` variables), merges
	 * `spacingPresetPreviewUsage` into `pickerProps` for global-styles preset preview.
	 */
	presetInterface?: PresetInterface | null | void,
	setValue: (newValue: any) => void,
	variableTypes?: Array<VariableCategory>,
	dynamicValueTypes?: Array<DynamicValueTypes>,
	onChange: (value: string | ValueAddon) => void,
};

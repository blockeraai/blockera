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
	/** Block attribute name (e.g. `blockeraFontColor`) for color variable preview context. */
	attribute?: string,
	/** Stable field id for spacing locked UI (e.g. `padding-top-bottom`). */
	controlFieldId?: string,
	/** Scopes plain-slug preset existence to one bucket (`color`, `spacing`, …). Optional. */
	themeJsonResolutionPresetCssVarInfix?: string,
};

export type UseValueAddonProps = {
	value: any,
	types?: AddonTypes,
	size?: ControlSize,
	pickerProps?: Object,
	pointerProps?: Object,
	/**
	 * When set (e.g. from InputControl / ColorControl), `presetInterface` is merged into `pickerProps`
	 * for global-styles preset preview via the implementation registered from `@blockera/editor`
	 * (`mergePickerPropsWithPresetPreviewInference`).
	 */
	presetInterface?: PresetInterface | null | void,
	setValue: (newValue: any) => void,
	variableTypes?: Array<VariableCategory>,
	dynamicValueTypes?: Array<DynamicValueTypes>,
	onChange: (value: string | ValueAddon) => void,
	/**
	 * Block name (e.g. `core/group`) for theme.json preset lookups when the control value is a plain
	 * **snake_case** preset slug string — matches `getValueAddonRealValue(..., { blockName })`.
	 */
	themeJsonResolutionBlockName?: string,
};

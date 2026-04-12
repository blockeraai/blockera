// @flow

/**
 * Hook name for embedding global preset editors in the variable picker.
 *
 * @see packages/editor/js/editor/register-var-picker-global-styles-panels.js
 */
export const VAR_PICKER_PRESET_PANEL_FILTER: string =
	'blockera.controls.var-picker.resolve-preset-panel';

/**
 * Variable types that use a two-column grid in the picker (keep in sync with layout rules).
 */
export const VAR_PICKER_TWO_COLUMN_TYPES: $ReadOnlyArray<string> = [
	'color',
	'linear-gradient',
	'radial-gradient',
	'spacing',
];

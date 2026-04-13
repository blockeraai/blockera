// @flow

/**
 * Hook for Site Editor / theme.json preset panels (spacing, gradients, etc.).
 *
 * @see packages/editor/js/editor/register-var-picker-global-styles-panels.js
 */
export const VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER: string =
	'blockera.controls.var-picker.resolve-global-styles-preset-panel';

/**
 * Hook for catalog-style fallback when no global-styles panel exists for a type.
 *
 * @see packages/editor/js/editor/register-var-picker-global-styles-panels.js
 */
export const VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER: string =
	'blockera.controls.var-picker.resolve-fallback-preset-panel';

/**
 * @deprecated Use {@link VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER}.
 */
export const VAR_PICKER_PRESET_PANEL_FILTER: string =
	VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER;

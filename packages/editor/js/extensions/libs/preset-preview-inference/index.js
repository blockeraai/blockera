// @flow

/**
 * Internal dependencies
 */
import { mergePickerPropsWithColorPresetPreview } from './color-preset-preview-inference';
import { mergePickerPropsWithSpacingPresetPreview } from './spacing-preset-preview-inference';

export * from './color-preset-preview-inference';
export * from './spacing-preset-preview-inference';

/**
 * Applies spacing then color preset preview inference (explicit `pickerProps` keys win).
 */
export function mergePickerPropsWithPresetPreviewInference(
	pickerProps: Object,
	presetInterface: Object | void | null
): Object {
	return mergePickerPropsWithColorPresetPreview(
		mergePickerPropsWithSpacingPresetPreview(pickerProps, presetInterface),
		presetInterface
	);
}

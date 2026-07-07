// @flow

/**
 * Internal dependencies
 */
import { mergePickerPropsWithBorderPresetPreview } from './border-preset-preview-inference';
import { mergePickerPropsWithBorderRadiusPresetPreview } from './border-radius-preset-preview-inference';
import { mergePickerPropsWithColorPresetPreview } from './color-preset-preview-inference';
import { mergePickerPropsWithFilterPresetPreview } from './filter-preset-preview-inference';
import { mergePickerPropsWithGradientPresetPreview } from './gradient-preset-preview-inference';
import { mergePickerPropsWithSpacingPresetPreview } from './spacing-preset-preview-inference';

export * from './border-preset-preview-inference';
export * from './border-radius-preset-preview-inference';
export * from './color-preset-preview-inference';
export * from './filter-preset-preview-inference';
export * from './gradient-preset-preview-inference';
export * from './spacing-preset-preview-inference';

/**
 * Applies spacing → border → border-radius → filter → gradient → color preset preview inference
 * (explicit `pickerProps` keys win).
 */
export function mergePickerPropsWithPresetPreviewInference(
	pickerProps: Object,
	presetInterface: Object | void | null
): Object {
	return mergePickerPropsWithColorPresetPreview(
		mergePickerPropsWithGradientPresetPreview(
			mergePickerPropsWithFilterPresetPreview(
				mergePickerPropsWithBorderRadiusPresetPreview(
					mergePickerPropsWithBorderPresetPreview(
						mergePickerPropsWithSpacingPresetPreview(
							pickerProps,
							presetInterface
						),
						presetInterface
					),
					presetInterface
				),
				presetInterface
			),
			presetInterface
		),
		presetInterface
	);
}

// @flow

import { BACKGROUND_GRADIENT_PRESET_PREVIEW_USAGE } from '../background/preset-preview/color-preset-preview-usage';
import {
	FONT_COLOR_PRESET_ATTRIBUTE,
	FONT_GRADIENT_PRESET_PREVIEW_USAGE,
} from '../typography/preset-preview/color-preset-preview-usage';

/**
 * Gradient preset row preview targets `background-image` or text gradient clip.
 *
 * @param {Object} args
 * @return {typeof FONT_GRADIENT_PRESET_PREVIEW_USAGE | typeof BACKGROUND_GRADIENT_PRESET_PREVIEW_USAGE | void} Text clip vs background gradient usage when inferrable; otherwise undefined.
 */
export function inferGradientPresetPreviewUsage(args: {
	variableTypes?: Array<string>,
	attribute?: string,
}):
	| typeof FONT_GRADIENT_PRESET_PREVIEW_USAGE
	| typeof BACKGROUND_GRADIENT_PRESET_PREVIEW_USAGE
	| void {
	const { variableTypes, attribute } = args;
	const types = variableTypes || [];
	const usesGradientPresets =
		types.includes('linear-gradient') || types.includes('radial-gradient');
	if (!usesGradientPresets) {
		return undefined;
	}
	const a = attribute || '';
	if (a === FONT_COLOR_PRESET_ATTRIBUTE) {
		return FONT_GRADIENT_PRESET_PREVIEW_USAGE;
	}
	return BACKGROUND_GRADIENT_PRESET_PREVIEW_USAGE;
}

/**
 * @param {Object} pickerProps
 * @param {Object|void|null} presetInterface
 * @return {Object} Picker props possibly including `gradientPresetPreviewUsage`.
 */
export function mergePickerPropsWithGradientPresetPreview(
	pickerProps: Object,
	presetInterface: Object | void | null
): Object {
	const inferred = presetInterface
		? inferGradientPresetPreviewUsage((presetInterface: any))
		: undefined;
	if (!inferred) {
		return pickerProps;
	}
	return {
		gradientPresetPreviewUsage: inferred,
		...pickerProps,
	};
}

// @flow

import {
	BACKGROUND_COLOR_PRESET_ATTRIBUTE,
	BACKGROUND_COLOR_PRESET_PREVIEW_USAGE,
} from '../background/preset-preview/color-preset-preview-usage';
import {
	BORDER_COLOR_PRESET_PREVIEW_USAGE,
	BORDER_PRESET_ATTRIBUTE,
} from '../border-and-shadow/components/border';
import {
	FONT_COLOR_PRESET_ATTRIBUTE,
	FONT_COLOR_PRESET_PREVIEW_USAGE,
} from '../typography/preset-preview/color-preset-preview-usage';

/**
 * @param {Object} args
 * @return {typeof FONT_COLOR_PRESET_PREVIEW_USAGE | typeof BACKGROUND_COLOR_PRESET_PREVIEW_USAGE | typeof BORDER_COLOR_PRESET_PREVIEW_USAGE | void} Color preview target when inferrable; otherwise undefined.
 */
export function inferColorPresetPreviewUsage(args: {
	variableTypes?: Array<string>,
	attribute?: string,
}):
	| typeof FONT_COLOR_PRESET_PREVIEW_USAGE
	| typeof BACKGROUND_COLOR_PRESET_PREVIEW_USAGE
	| typeof BORDER_COLOR_PRESET_PREVIEW_USAGE
	| void {
	const { variableTypes, attribute } = args;
	if (!variableTypes || !variableTypes.includes('color')) {
		return undefined;
	}
	const a = attribute || '';
	if (a === FONT_COLOR_PRESET_ATTRIBUTE) {
		return FONT_COLOR_PRESET_PREVIEW_USAGE;
	}
	if (a === BACKGROUND_COLOR_PRESET_ATTRIBUTE) {
		return BACKGROUND_COLOR_PRESET_PREVIEW_USAGE;
	}
	if (a === BORDER_PRESET_ATTRIBUTE) {
		return BORDER_COLOR_PRESET_PREVIEW_USAGE;
	}
	return undefined;
}

/**
 * Merges inferred `colorPresetPreviewUsage` into picker props (explicit `pickerProps` wins).
 *
 * @param {Object} pickerProps Existing picker props from the value addon.
 * @param {Object|void|null} presetInterface Optional `variableTypes` + `attribute` from the opening control.
 * @return {Object} Picker props possibly including `colorPresetPreviewUsage`.
 */
export function mergePickerPropsWithColorPresetPreview(
	pickerProps: Object,
	presetInterface: Object | void | null
): Object {
	const inferred = presetInterface
		? inferColorPresetPreviewUsage((presetInterface: any))
		: undefined;
	if (!inferred) {
		return pickerProps;
	}
	return {
		colorPresetPreviewUsage: inferred,
		...pickerProps,
	};
}

// @flow

import {
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL,
	BORDER_RADIUS_PRESET_PREVIEW_USAGES,
} from '../border-and-shadow/components/border-radius';

/**
 * @param {Object} args
 * @return {typeof BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL | void} Border-radius corner usage when inferrable; otherwise undefined.
 */
export function inferBorderRadiusPresetPreviewUsage(args: {
	variableTypes?: Array<string>,
	id?: string,
}): typeof BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL | void {
	const { variableTypes, id } = args;
	if (!variableTypes || !variableTypes.includes('border-radius')) {
		return undefined;
	}
	const corner = String(id ?? BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL);
	if (BORDER_RADIUS_PRESET_PREVIEW_USAGES.includes(corner)) {
		return (corner: any);
	}
	return BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL;
}

/**
 * @param {Object} pickerProps
 * @param {Object|void|null} presetInterface
 * @return {Object} Picker props possibly including `borderRadiusPresetPreviewUsage`.
 */
export function mergePickerPropsWithBorderRadiusPresetPreview(
	pickerProps: Object,
	presetInterface: Object | void | null
): Object {
	const inferred = presetInterface
		? inferBorderRadiusPresetPreviewUsage((presetInterface: any))
		: undefined;
	if (!inferred) {
		return pickerProps;
	}
	return {
		borderRadiusPresetPreviewUsage: inferred,
		...pickerProps,
	};
}

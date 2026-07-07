// @flow

import {
	BORDER_PRESET_PREVIEW_USAGE_ALL,
	BORDER_PRESET_PREVIEW_USAGES,
} from '../border-and-shadow/components/border';

/**
 * @param {Object} args
 * @return {typeof BORDER_PRESET_PREVIEW_USAGE_ALL | void} Border side usage when inferrable; otherwise undefined.
 */
export function inferBorderPresetPreviewUsage(args: {
	variableTypes?: Array<string>,
	id?: string,
}): typeof BORDER_PRESET_PREVIEW_USAGE_ALL | void {
	const { variableTypes, id } = args;
	if (!variableTypes || !variableTypes.includes('border')) {
		return undefined;
	}
	const side = String(id ?? BORDER_PRESET_PREVIEW_USAGE_ALL);
	if (BORDER_PRESET_PREVIEW_USAGES.includes(side)) {
		return (side: any);
	}
	return BORDER_PRESET_PREVIEW_USAGE_ALL;
}

/**
 * @param {Object} pickerProps
 * @param {Object|void|null} presetInterface
 * @return {Object} Picker props possibly including `borderPresetPreviewUsage`.
 */
export function mergePickerPropsWithBorderPresetPreview(
	pickerProps: Object,
	presetInterface: Object | void | null
): Object {
	const inferred = presetInterface
		? inferBorderPresetPreviewUsage((presetInterface: any))
		: undefined;
	if (!inferred) {
		return pickerProps;
	}
	return {
		borderPresetPreviewUsage: inferred,
		...pickerProps,
	};
}

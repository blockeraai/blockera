// @flow

/**
 * @param {Object} args
 * @return {'color' | 'background' | void} Font vs background preview mode when inferrable; otherwise undefined.
 */
export function inferColorPresetPreviewUsage(args: {
	variableTypes?: Array<string>,
	attribute?: string,
}): 'color' | 'background' | void {
	const { variableTypes, attribute } = args;
	if (!variableTypes || !variableTypes.includes('color')) {
		return undefined;
	}
	const a = attribute || '';
	if (a === 'blockeraFontColor') {
		return 'color';
	}
	if (a === 'blockeraBackgroundColor') {
		return 'background';
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

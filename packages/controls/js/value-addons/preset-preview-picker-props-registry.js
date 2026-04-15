// @flow

/**
 * Global-styles preset preview merges `colorPresetPreviewUsage` / `spacingPresetPreviewUsage`
 * into var-picker props. Implementations live in `@blockera/editor` and are registered at
 * bootstrap (see `register-global-styles-preset-preview-helpers.js`).
 */

let mergePickerPropsWithPresetPreview:
	| ((pickerProps: Object, presetInterface: Object | void | null) => Object)
	| void;

/**
 * Called once when `@blockera/editor` loads; wires color/spacing preset preview inference.
 */
export function registerValueAddonPresetPreviewPickerMerge(
	fn: (pickerProps: Object, presetInterface: Object | void | null) => Object
): void {
	mergePickerPropsWithPresetPreview = fn;
}

export function applyRegisteredPresetPreviewPickerMerge(
	pickerProps: Object,
	presetInterface: Object | void | null
): Object {
	if (mergePickerPropsWithPresetPreview) {
		return mergePickerPropsWithPresetPreview(pickerProps, presetInterface);
	}
	return pickerProps;
}

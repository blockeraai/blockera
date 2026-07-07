// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';

export function applyRegisteredPresetPreviewPickerMerge(
	pickerProps: Object,
	presetInterface: Object | void | null
): Object {
	const mergePickerPropsWithPresetPreview = applyFilters(
		'blockera.controls.var-picker.merge-picker-props-with-preset-preview',
		undefined
	);

	if (mergePickerPropsWithPresetPreview) {
		return mergePickerPropsWithPresetPreview(pickerProps, presetInterface);
	}

	return pickerProps;
}

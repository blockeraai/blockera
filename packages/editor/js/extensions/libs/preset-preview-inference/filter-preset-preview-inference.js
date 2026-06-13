// @flow

import {
	BACKDROP_FILTER_PRESET_ATTRIBUTE,
	BACKDROP_FILTER_PRESET_PREVIEW_USAGE,
} from '../effects/components/backdrop-filter';
import {
	FILTER_PRESET_ATTRIBUTE,
	FILTER_PRESET_PREVIEW_USAGE,
} from '../effects/components/filter';

/**
 * @param {Object} args
 * @return {typeof FILTER_PRESET_PREVIEW_USAGE | typeof BACKDROP_FILTER_PRESET_PREVIEW_USAGE | void} Filter vs backdrop-filter usage when inferrable; otherwise undefined.
 */
export function inferFilterPresetPreviewUsage(args: {
	variableTypes?: Array<string>,
	attribute?: string,
}):
	| typeof FILTER_PRESET_PREVIEW_USAGE
	| typeof BACKDROP_FILTER_PRESET_PREVIEW_USAGE
	| void {
	const { variableTypes, attribute } = args;
	if (!variableTypes || !variableTypes.includes('filter')) {
		return undefined;
	}
	const a = attribute || '';
	if (a === BACKDROP_FILTER_PRESET_ATTRIBUTE) {
		return BACKDROP_FILTER_PRESET_PREVIEW_USAGE;
	}
	if (a === FILTER_PRESET_ATTRIBUTE) {
		return FILTER_PRESET_PREVIEW_USAGE;
	}
	return undefined;
}

/**
 * Merges inferred `filterPresetPreviewUsage` into picker props (explicit `pickerProps` wins).
 */
export function mergePickerPropsWithFilterPresetPreview(
	pickerProps: Object,
	presetInterface: Object | void | null
): Object {
	const inferred = presetInterface
		? inferFilterPresetPreviewUsage((presetInterface: any))
		: undefined;
	if (!inferred) {
		return pickerProps;
	}
	return {
		filterPresetPreviewUsage: inferred,
		...pickerProps,
	};
}

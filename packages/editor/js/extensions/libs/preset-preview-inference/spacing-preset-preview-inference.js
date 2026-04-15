// @flow

/**
 * Infers `spacingPresetPreviewUsage` for global-styles spacing preset row hover preview from
 * dimension controls that offer `spacing` in `variableTypes` (see InputControl / useValueAddon).
 *
 * @param {Object} args
 * @return {string|void} Preview usage key when inferable, otherwise undefined.
 */
export function inferSpacingPresetPreviewUsage(args: {
	variableTypes?: Array<string>,
	unitType?: string,
	id?: string,
	singularId?: string | number,
}): string | void {
	const { variableTypes, unitType, id, singularId } = args;
	if (!variableTypes || !variableTypes.includes('spacing')) {
		return undefined;
	}
	const u = unitType || '';
	if (u === 'padding') {
		return 'padding';
	}
	if (u === 'margin') {
		return 'margin';
	}
	if (
		u === 'width' ||
		u === 'min-width' ||
		u === 'max-width' ||
		u === 'grid-min-width'
	) {
		return 'width';
	}
	if (u === 'height' || u === 'min-height' || u === 'max-height') {
		return 'height';
	}
	if (u === 'essential') {
		const leaf = String(singularId ?? id ?? '');
		if (leaf === 'gap' || leaf === 'rows' || leaf === 'columns') {
			return 'gap';
		}
	}
	return undefined;
}

/**
 * Merges inferred `spacingPresetPreviewUsage` into picker props (explicit `pickerProps` wins).
 *
 * @param {Object} pickerProps
 * @param {Object|void} presetInterface Control metadata from `presetInterface` on value-addon props.
 * @return {Object} Picker props merged with inferred `spacingPresetPreviewUsage` when applicable.
 */
export function mergePickerPropsWithSpacingPresetPreview(
	pickerProps: Object,
	presetInterface: Object | void | null
): Object {
	const inferred = presetInterface
		? inferSpacingPresetPreviewUsage((presetInterface: any))
		: undefined;
	if (!inferred) {
		return pickerProps;
	}
	return {
		spacingPresetPreviewUsage: inferred,
		...pickerProps,
	};
}

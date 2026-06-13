// @flow

import {
	BLOCKERA_GAP_ATTRIBUTE,
	LAYOUT_SPACING_COMBINED_CONTROL_FIELD_IDS,
	SPACING_GAP,
	SPACING_GAP_COLUMNS,
	SPACING_GAP_ROWS,
	SPACING_MARGIN,
	SPACING_PADDING,
} from '../layout/preset-preview/spacing-preset-preview-usage';
import {
	BLOCKERA_HEIGHT_ATTRIBUTE,
	BLOCKERA_MAX_HEIGHT_ATTRIBUTE,
	BLOCKERA_MAX_WIDTH_ATTRIBUTE,
	BLOCKERA_MIN_HEIGHT_ATTRIBUTE,
	BLOCKERA_MIN_WIDTH_ATTRIBUTE,
	BLOCKERA_WIDTH_ATTRIBUTE,
	SPACING_HEIGHT,
	SPACING_MAX_HEIGHT,
	SPACING_MAX_WIDTH,
	SPACING_MIN_HEIGHT,
	SPACING_MIN_WIDTH,
	SPACING_WIDTH,
} from '../size/preset-preview/spacing-preset-preview-usage';

const SPACING_SIDES = ['top', 'right', 'bottom', 'left'];
const SPACING_BOXES = [SPACING_PADDING, SPACING_MARGIN];

/**
 * @param {string} controlFieldId Locked UI field id (e.g. `padding-top-bottom`).
 * @return {string|void} Combined spacing usage from locked control field id when inferrable; otherwise undefined.
 */
function inferSpacingUsageFromControlFieldId(
	controlFieldId: string
): string | void {
	if (LAYOUT_SPACING_COMBINED_CONTROL_FIELD_IDS.includes(controlFieldId)) {
		return controlFieldId;
	}
	return undefined;
}

/**
 * @param {string} leaf Control `id` / `singularId` (e.g. `padding.top`, `rows`).
 * @return {string|void} Per-side spacing or gap usage from control id when inferrable; otherwise undefined.
 */
function inferSpacingUsageFromControlId(leaf: string): string | void {
	if (!leaf) {
		return undefined;
	}

	if (leaf === SPACING_GAP) {
		return SPACING_GAP;
	}
	if (leaf === 'rows') {
		return SPACING_GAP_ROWS;
	}
	if (leaf === 'columns') {
		return SPACING_GAP_COLUMNS;
	}

	const parts = leaf.split('.');
	if (parts.length !== 2) {
		return undefined;
	}

	const [box, side] = parts;
	if (!SPACING_BOXES.includes(box) || !SPACING_SIDES.includes(side)) {
		return undefined;
	}

	return `${box}-${side}`;
}

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
	attribute?: string,
	controlFieldId?: string,
}): string | void {
	const {
		variableTypes,
		unitType,
		id,
		singularId,
		attribute,
		controlFieldId,
	} = args;
	if (!variableTypes || !variableTypes.includes('spacing')) {
		return undefined;
	}

	const fromControlFieldId = inferSpacingUsageFromControlFieldId(
		String(controlFieldId ?? '')
	);
	if (fromControlFieldId) {
		return fromControlFieldId;
	}

	const fromId = inferSpacingUsageFromControlId(
		String(singularId ?? id ?? '')
	);
	if (fromId) {
		return fromId;
	}

	const a = attribute || '';
	if (a === BLOCKERA_MIN_WIDTH_ATTRIBUTE) {
		return SPACING_MIN_WIDTH;
	}
	if (a === BLOCKERA_MAX_WIDTH_ATTRIBUTE) {
		return SPACING_MAX_WIDTH;
	}
	if (a === BLOCKERA_WIDTH_ATTRIBUTE) {
		return SPACING_WIDTH;
	}
	if (a === BLOCKERA_MIN_HEIGHT_ATTRIBUTE) {
		return SPACING_MIN_HEIGHT;
	}
	if (a === BLOCKERA_MAX_HEIGHT_ATTRIBUTE) {
		return SPACING_MAX_HEIGHT;
	}
	if (a === BLOCKERA_HEIGHT_ATTRIBUTE) {
		return SPACING_HEIGHT;
	}
	if (a === BLOCKERA_GAP_ATTRIBUTE) {
		return SPACING_GAP;
	}

	const u = unitType || '';
	if (u === SPACING_PADDING) {
		return SPACING_PADDING;
	}
	if (u === SPACING_MARGIN) {
		return SPACING_MARGIN;
	}
	if (u === SPACING_WIDTH || u === 'grid-min-width') {
		return SPACING_WIDTH;
	}
	if (u === SPACING_MIN_WIDTH) {
		return SPACING_MIN_WIDTH;
	}
	if (u === SPACING_MAX_WIDTH) {
		return SPACING_MAX_WIDTH;
	}
	if (u === SPACING_HEIGHT) {
		return SPACING_HEIGHT;
	}
	if (u === SPACING_MIN_HEIGHT) {
		return SPACING_MIN_HEIGHT;
	}
	if (u === SPACING_MAX_HEIGHT) {
		return SPACING_MAX_HEIGHT;
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

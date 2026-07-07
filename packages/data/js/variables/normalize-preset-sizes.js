// @flow
/**
 * Blockera dependencies
 */
import { normalizeCssLengthValue } from '@blockera/utils';

/**
 * theme.json preset sizes (font-size, spacing, border-radius): shorthand decimals
 * like `.9rem` → `0.9rem`. Empty defaultUnit keeps bare `0` as `0` (not `0px`).
 *
 * @param {*} value Raw size from theme.json.
 * @return {string} Normalized CSS length string.
 */
export function normalizePresetSize(value: mixed): string {
	return normalizeCssLengthValue(value, '');
}

type FontSizeFluid = boolean | { min?: string, max?: string } | null | void;

/**
 * @param {FontSizeFluid} fluid Fluid flag or custom min/max object from theme.json.
 * @return {FontSizeFluid} Same shape with normalized min/max lengths when applicable.
 */
export function normalizeFontSizeFluid(fluid: FontSizeFluid): FontSizeFluid {
	if (!fluid || typeof fluid !== 'object') {
		return fluid;
	}

	const out: { min?: string, max?: string } = { ...fluid };

	if (typeof out.min === 'string') {
		out.min = normalizePresetSize(out.min);
	}

	if (typeof out.max === 'string') {
		out.max = normalizePresetSize(out.max);
	}

	return out;
}

/**
 * @param {Object} item theme.json font-size preset row.
 */
export function normalizeFontSizeThemeJsonPreset(item: {
	size?: mixed,
	fluid?: FontSizeFluid,
	[string]: mixed,
}): { [string]: mixed } {
	const result: { [string]: mixed } = { ...item };

	if (item.size !== undefined && item.size !== null) {
		result.size = normalizePresetSize(item.size);
	}

	if (item.fluid !== undefined) {
		result.fluid = normalizeFontSizeFluid(item.fluid);
	}

	return result;
}

/**
 * @param {Object} item theme.json spacing or border-radius preset row.
 */
export function normalizeSizeThemeJsonPreset(item: {
	size?: mixed,
	[string]: mixed,
}): { [string]: mixed } {
	const result: { [string]: mixed } = { ...item };

	if (item.size !== undefined && item.size !== null) {
		result.size = normalizePresetSize(item.size);
	}

	return result;
}

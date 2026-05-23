// @flow

/**
 * Blockera dependencies
 */
import { generateVariableStringFromAttributeVarString } from '@blockera/data';

/**
 * Internal dependencies
 */
import { isLikelyRawCssColorInput } from '../libs/color-picker-control/utils/css-color';
import type { ValueAddon } from './types';

export function isValid(value: ValueAddon | string): boolean {
	//$FlowFixMe
	return !!value?.isValueAddon;
}

/**
 * Whether `s` looks like a theme.json preset **slug** (not raw CSS).
 * Used to avoid treating arbitrary stored strings (e.g. hex colors) as orphan presets.
 */
export function isLikelyThemeJsonPlainPresetSlugString(s: string): boolean {
	if (typeof s !== 'string' || s === '') {
		return false;
	}
	if (s.trim() !== s) {
		return false;
	}
	if (s.startsWith('#')) {
		return false;
	}
	if (s.includes('var(') || s.includes('(')) {
		return false;
	}
	if (/\s/.test(s)) {
		return false;
	}
	// Free-form CSS colors (keywords, hex, rgb, in-progress typing) are not preset slugs.
	if (isLikelyRawCssColorInput(s)) {
		return false;
	}
	// Slugs start with a letter so values like `12px` / `500` are not treated as presets.
	return /^[a-z][a-z0-9_-]*(?:-[a-z0-9_-]+)*$/i.test(s);
}

/**
 * `{paint},{slug}` palette/composite storage: slug suffix matches WP preset slug shape (starts with letter).
 * Split scans commas right-to-left so `paint` may contain commas (e.g. `rgb()`, gradients).
 */
const COMPOSITE_PLAIN_COLOR_SLUG_SUFFIX_RE =
	/^[a-z][a-z0-9_-]*(?:-[a-z0-9_-]+)*$/i;

/**
 * Returns `{ realPart, slugPart }` for composite strings. `realPart` is stored verbatim (may include `var()`).
 * To use the explicit fallback inside `var(…, fallback)` as a scalar color, use
 * `normalizeCompositePlainPresetPaintPart(realPart)` or `compositePlainColorPaintFromStoredPlainPresetInput`.
 */
export function splitStoredCompositePlainColorValue(
	value: string
): {| realPart: string, slugPart: string |} | null {
	if (typeof value !== 'string' || value === '') {
		return null;
	}
	let idx = value.lastIndexOf(',');
	while (idx > 0) {
		const slugPart = value.slice(idx + 1).trim();
		const realPart = value.slice(0, idx).trim();
		if (
			realPart !== '' &&
			slugPart !== '' &&
			COMPOSITE_PLAIN_COLOR_SLUG_SUFFIX_RE.test(slugPart)
		) {
			return { realPart, slugPart };
		}
		idx = value.lastIndexOf(',', idx - 1);
	}
	return null;
}

/**
 * Preset slug for merged-theme lookups when stored plain strings may be `resolvedCss,presetSlug`.
 */
export function plainPresetSlugFromStoredPlainPresetInput(
	strippedPlainInput: string
): string {
	const hit = splitStoredCompositePlainColorValue(strippedPlainInput);
	if (hit) {
		return hit.slugPart;
	}
	return typeof strippedPlainInput === 'string'
		? strippedPlainInput.trim()
		: '';
}

/** Non-empty `ValueAddonControlProps.themeJsonPlainPresetSlug` (merged theme.json preset slug). */
export function hasThemeJsonPlainPresetSlug(
	themeJsonPlainPresetSlug: mixed
): boolean {
	return (
		typeof themeJsonPlainPresetSlug === 'string' &&
		themeJsonPlainPresetSlug !== ''
	);
}

/** Structured value-addon object or plain merged theme.json preset slug (picker / chip UI). */
export function isAddonUiActive(
	value: ValueAddon | string,
	themeJsonPlainPresetSlug?: mixed
): boolean {
	//$FlowFixMe
	return (
		isValid(value) || hasThemeJsonPlainPresetSlug(themeJsonPlainPresetSlug)
	);
}

/**
 * Extracts the fallback value from a CSS var() function
 * Handles nested var() functions recursively
 */
export function extractCssVarValue(value: string): string {
	if (!value || typeof value !== 'string') {
		return value;
	}

	// Check if the value contains var()
	if (!value.includes('var(')) {
		return value;
	}

	// Process var() functions from inside out
	let result = value;

	while (result.includes('var(')) {
		// Find the last (innermost) var() occurrence
		const lastVarStart = result.lastIndexOf('var(');
		const subStr = result.slice(lastVarStart);

		// Find the matching closing parenthesis for the var() function
		let openParens = 1;
		let closeIndex = -1;

		for (let i = 4; i < subStr.length; i++) {
			// Start after 'var('
			if (subStr[i] === '(') {
				openParens++;
			}
			if (subStr[i] === ')') {
				openParens--;
				if (openParens === 0) {
					closeIndex = i;
					break;
				}
			}
		}

		if (closeIndex === -1) {
			break;
		}

		const varFunction = subStr.slice(0, closeIndex + 1);

		// Extract the variable name and fallback
		const commaIndex = varFunction.indexOf(',');
		if (commaIndex === -1) {
			// No fallback value
			result =
				result.slice(0, lastVarStart) +
				'' +
				result.slice(lastVarStart + varFunction.length);
		} else {
			// Get the fallback value (everything between the comma and the last parenthesis)
			const fallback = varFunction.slice(commaIndex + 1, -1).trim();
			result =
				result.slice(0, lastVarStart) +
				fallback +
				result.slice(lastVarStart + varFunction.length);
		}
	}

	return result;
}

/**
 * When `paint` is `var(… , fallback)`, returns `fallback` for UI / scalar handlers.
 * Otherwise returns `paint` trimmed (including plain hex/rgb or `var()` without fallback).
 */
export function normalizeCompositePlainPresetPaintPart(paint: string): string {
	const raw = typeof paint === 'string' ? paint.trim() : '';
	if (raw === '' || !raw.includes('var(')) {
		return raw;
	}
	const extracted = extractCssVarValue(raw);
	if (
		typeof extracted === 'string' &&
		extracted !== '' &&
		extracted.trim() !== ''
	) {
		return extracted.trim();
	}
	return raw;
}

/**
 * Resolved paint from composite storage `paint,presetSlug`: splits like
 * splitStoredCompositePlainColorValue, then normalizes `realPart` so `var(--wp--preset--…, #rgb)`
 * yields the literal fallback for indicators/unlink.
 */
export function compositePlainColorPaintFromStoredPlainPresetInput(
	strippedPlainInput: string
): string {
	const hit = splitStoredCompositePlainColorValue(strippedPlainInput);
	if (!hit) {
		return '';
	}
	return normalizeCompositePlainPresetPaintPart(hit.realPart);
}

/**
 * Scalar to persist after unlinking a missing plain preset stored as
 * `resolvedCss,presetSlug`: extracts the explicit CSS var() fallback for `--wp--preset--…--slug`.
 */
export function unlinkPlainThemeJsonPresetCompositeToScalar(
	compositeResolvedPart: string,
	presetSlug: string,
	presetCssVarInfix?: string
): string {
	const part =
		typeof compositeResolvedPart === 'string' ? compositeResolvedPart : '';
	const slug = typeof presetSlug === 'string' ? presetSlug.trim() : '';
	if (part === '' || slug === '') {
		return part;
	}
	const infix =
		presetCssVarInfix !== undefined &&
		presetCssVarInfix !== null &&
		String(presetCssVarInfix) !== ''
			? String(presetCssVarInfix)
			: 'color';
	const presetAttrToken = `var:preset|${infix}|${slug}`;
	const cssVarCore =
		generateVariableStringFromAttributeVarString(presetAttrToken);
	const syntheticVar = `var(${cssVarCore}, ${part})`;
	const extracted = extractCssVarValue(syntheticVar);
	const next =
		typeof extracted === 'string' &&
		extracted !== '' &&
		extracted.trim() !== ''
			? extracted.trim()
			: part;
	return next;
}

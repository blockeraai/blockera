// @flow

/**
 * Internal dependencies
 */
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
	// Slugs start with a letter so values like `12px` / `500` are not treated as presets.
	return /^[a-z][a-z0-9_-]*(?:-[a-z0-9_-]+)*$/i.test(s);
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

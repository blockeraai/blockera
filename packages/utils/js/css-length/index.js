// @flow

/**
 * Core / saved JSON often uses bare `0` or the number `0` for CSS lengths (border width,
 * shadow offsets, etc.). Blockera UI and generators expect an explicit px length where needed.
 *
 * @param {*} value Raw width/length from block attributes or parsed tokens.
 * @return {string} `0px` for bare zero; otherwise the original string form (empty stays empty).
 */
export function normalizeCssLengthValue(value: mixed): string {
	if (value === undefined || value === null) {
		return '';
	}
	if (typeof value === 'number') {
		return value === 0 ? '0px' : String(value);
	}
	const s = String(value);
	return s.trim() === '0' ? '0px' : s;
}

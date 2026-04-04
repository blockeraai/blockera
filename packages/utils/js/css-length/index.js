// @flow

/**
 * Core / saved JSON often uses bare `0` or the number `0` for CSS lengths (border width,
 * shadow offsets, etc.). Blockera UI and generators expect an explicit px length where needed.
 *
 * @param {*} value Raw width/length from block attributes or parsed tokens.
 * @param {string} [defaultUnit='px'] Suffix for bare zero and unitless shorthand decimals (`''` keeps a number-only token).
 * @return {string} Bare `0` → `0` + defaultUnit; shorthand decimals normalized; bare shorthand numbers get defaultUnit; otherwise the original string form (empty stays empty).
 */
export function normalizeCssLengthValue(
	value: mixed,
	defaultUnit: string = 'px'
): string {
	if (value === undefined || value === null) {
		return '';
	}
	if (typeof value === 'number') {
		return value === 0 ? `0${defaultUnit}` : String(value);
	}
	const s = String(value);
	const t = s.trim();
	if (t === '0') {
		return `0${defaultUnit}`;
	}
	// Shorthand decimal at the start (valid CSS): -.5px → -0.5px, .5rem → 0.5rem
	if (/^(-?)\.\d/.test(t)) {
		let out = t.replace(/^(-?)\./, (_m, sign) => `${sign}0.`);
		// No unit on the token → append defaultUnit (same as bare `0`)
		if (/^-?\d+\.\d+$/.test(out)) {
			out += defaultUnit;
		}
		return out;
	}
	return s;
}

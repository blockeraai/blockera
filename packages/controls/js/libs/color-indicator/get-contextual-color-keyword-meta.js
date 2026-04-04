// @flow

/**
 * CSS-wide color keywords that do not map to a single fixed preview in the UI
 * (same idea as sketch-blocked keywords in the color picker).
 */
const KEYWORD_ABBREV: { [string]: string } = {
	transparent: 'Tr',
	currentcolor: 'CC',
	inherit: 'In',
	initial: 'It',
	unset: 'Un',
	revert: 'Re',
	'revert-layer': 'Rv',
};

/**
 * @return {?{ abbrev: string, normalized: string }} Metadata for swatch badge when `raw` is a known contextual keyword, else null.
 */
export function getContextualColorKeywordMeta(
	raw: string
): {| abbrev: string, normalized: string |} | null {
	if (typeof raw !== 'string') {
		return null;
	}
	const normalized = raw.trim().toLowerCase();
	if (normalized === '') {
		return null;
	}
	const abbrev = KEYWORD_ABBREV[normalized];
	if (!abbrev) {
		return null;
	}
	return { abbrev, normalized };
}

// @flow
/**
 * External dependencies
 */
import tinycolor from 'tinycolor2';

const RGBA_MATCHER =
	/rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;
const HSLA_MATCHER =
	/hsla?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;

function normalizeHexInput(value: string): string {
	const t = value.trim();
	if (t.startsWith('#')) {
		return '#' + t.slice(1).replace(/\s/g, '').toLowerCase();
	}
	const compact = t.replace(/\s/g, '');
	if (/^[a-fA-F0-9]{3,8}$/.test(compact)) {
		return '#' + compact.toLowerCase();
	}
	return t;
}

/**
 * True when the string is a parseable hex (or hex8) color (e.g. EyeDropper output).
 */
export function validHex(value: string): boolean {
	if (!value || typeof value !== 'string') {
		return false;
	}
	const tc = tinycolor(value.trim());
	if (!tc.isValid()) {
		return false;
	}
	const fmt = tc.getFormat();
	return fmt === 'hex' || fmt === 'hex8';
}

const SKETCH_BLOCKED_KEYWORDS: Set<string> = new Set([
	'transparent',
	'currentcolor',
	'inherit',
	'initial',
	'unset',
	'revert',
	'revert-layer',
]);

/**
 * True when the stored string is (or is being typed as) raw CSS color syntax,
 * not a theme.json preset slug. Used by value-addon slug heuristics.
 */
export function isLikelyRawCssColorInput(input: string): boolean {
	if (input === null || input === undefined || typeof input !== 'string') {
		return false;
	}
	const trimmed = input.trim();
	if (trimmed === '') {
		return false;
	}

	if (trimmed.startsWith('#')) {
		return true;
	}
	if (/var\s*\(/i.test(trimmed)) {
		return true;
	}
	if (/^\s*rgba?\s*\(/i.test(trimmed)) {
		return true;
	}
	if (/^\s*hsla?\s*\(/i.test(trimmed)) {
		return true;
	}

	const norm = trimmed.toLowerCase();

	if (SKETCH_BLOCKED_KEYWORDS.has(norm)) {
		return true;
	}

	// In-progress keyword typing (e.g. "c" → currentColor).
	for (const kw of SKETCH_BLOCKED_KEYWORDS) {
		if (norm.length < kw.length && kw.startsWith(norm)) {
			return true;
		}
	}

	// CSS keywords such as currentColor use camelCase; theme.json slugs are lowercase.
	if (/[A-Z]/.test(trimmed)) {
		return true;
	}

	const tc = tinycolor(trimmed);
	if (tc.isValid() && tc.getFormat() === 'name') {
		return true;
	}

	// Partial hex bodies while typing (without forcing a leading #).
	if (/^[0-9a-f]+$/i.test(trimmed)) {
		return true;
	}

	return false;
}

/**
 * True when the stored CSS color can be driven by react-color Sketch (hex, named, rgb/rgba only).
 * Values like var(), keywords, hsl/hwb/lch/oklch, color-mix(), etc. stay editable as text but disable the wheel.
 */
export function isColorControllableBySketchPicker(input: string): boolean {
	if (input === null || input === undefined || typeof input !== 'string') {
		return true;
	}
	const trimmed = input.trim();
	if (trimmed === '') {
		return true;
	}

	const norm = trimmed.toLowerCase().replace(/\s+/g, ' ').trim();
	if (SKETCH_BLOCKED_KEYWORDS.has(norm)) {
		return false;
	}

	if (/var\s*\(/i.test(trimmed)) {
		return false;
	}

	if (/color-mix\s*\(/i.test(norm)) {
		return false;
	}

	if (/^\s*color\s*\(/i.test(trimmed)) {
		return false;
	}

	if (/\brgb\s*\(\s*from\b/i.test(trimmed)) {
		return false;
	}
	if (/\brgba\s*\(\s*from\b/i.test(trimmed)) {
		return false;
	}

	if (/^\s*hsla?\s*\(/i.test(trimmed)) {
		return false;
	}
	if (/^\s*hwb\s*\(/i.test(trimmed)) {
		return false;
	}
	if (/^\s*lch\s*\(/i.test(trimmed)) {
		return false;
	}
	if (/^\s*lab\s*\(/i.test(trimmed)) {
		return false;
	}
	if (/^\s*oklch\s*\(/i.test(trimmed)) {
		return false;
	}
	if (/^\s*oklab\s*\(/i.test(trimmed)) {
		return false;
	}

	if (/^\s*cmyk\s*\(/i.test(trimmed)) {
		return false;
	}
	if (/^\s*device-cmyk\s*\(/i.test(trimmed)) {
		return false;
	}

	if (/^\s*rgba?\s*\(/i.test(trimmed)) {
		return tinycolor(trimmed).isValid();
	}

	return tinycolor(trimmed).isValid();
}

/**
 * `color` prop for casesandberg/react-color SketchPicker when the stored value is plain CSS.
 * Non-parseable values (e.g. var(), currentColor) fall back to black so the wheel still mounts.
 */
export function getSketchPickerColor(input: string): string {
	if (!input || typeof input !== 'string' || !input.trim()) {
		return '#000000';
	}
	const trimmed = input.trim();
	const tc = tinycolor(trimmed);
	if (!tc.isValid()) {
		return '#000000';
	}
	return trimmed;
}

/**
 * Serialize react-color ColorWrap `onChange` payload to the control string.
 */
export function reactColorStateToStorageString(
	colors: Object,
	enableAlpha: boolean
): string {
	const hex = colors.hex;
	const rgb = colors.rgb;
	if (!hex || typeof hex !== 'string') {
		return '';
	}
	if (hex === 'transparent') {
		return 'transparent';
	}
	const withHash = hex.charAt(0) === '#' ? hex : '#' + hex;
	const tc = tinycolor(withHash);
	if (!tc.isValid()) {
		return '';
	}
	const lower6 = tc.toHexString().toLowerCase();
	if (
		!enableAlpha ||
		!rgb ||
		rgb.a === undefined ||
		rgb.a === null ||
		rgb.a >= 1
	) {
		return lower6;
	}
	return tinycolor({
		r: rgb.r,
		g: rgb.g,
		b: rgb.b,
		a: rgb.a,
	})
		.toHex8String()
		.toLowerCase();
}

function isInProgressCssKeyword(trimmed: string): boolean {
	const norm = trimmed.toLowerCase();

	if (SKETCH_BLOCKED_KEYWORDS.has(norm)) {
		return false;
	}

	for (const kw of SKETCH_BLOCKED_KEYWORDS) {
		if (norm.length < kw.length && kw.startsWith(norm)) {
			return true;
		}
	}

	return false;
}

function isThreeDigitHexShorthand(trimmed: string): boolean {
	const body = trimmed.startsWith('#')
		? trimmed.slice(1).replace(/\s/g, '')
		: trimmed.replace(/\s/g, '');

	return /^[0-9a-f]{3}$/i.test(body);
}

function expandThreeDigitHexShorthand(trimmed: string): ?string {
	const withHash = trimmed.startsWith('#')
		? trimmed
		: '#' + trimmed.replace(/\s/g, '');
	const tc = tinycolor(withHash);

	if (!tc.isValid()) {
		return null;
	}

	const fmt = tc.getFormat();

	if (fmt !== 'hex' && fmt !== 'hex8') {
		return null;
	}

	if (fmt === 'hex8' && tc.getAlpha() < 1) {
		return tc.toHex8String().toLowerCase();
	}

	return tc.toHexString().toLowerCase();
}

type ValueCleanupColorOptions = {|
	finalize?: boolean,
|};

/**
 * Normalize user input without destroying case-sensitive CSS (e.g. custom properties).
 */
export function valueCleanupColorString(
	value: string,
	options: ValueCleanupColorOptions = {}
): string {
	const { finalize = false } = options;

	if (value === '' || value === null || value === undefined) {
		return '';
	}
	const trimmed = value.trim();
	if (!trimmed) {
		return '';
	}

	if (/var\s*\(/i.test(trimmed)) {
		return trimmed;
	}

	if (isInProgressCssKeyword(trimmed)) {
		return trimmed;
	}

	// 3-digit shorthand is finalized on blur/close so longer hex (e.g. "c4c4c4") is not truncated.
	if (finalize && isThreeDigitHexShorthand(trimmed)) {
		const expanded = expandThreeDigitHexShorthand(trimmed);

		if (expanded) {
			return expanded;
		}
	}

	const hexSource = trimmed.startsWith('#')
		? '#' + trimmed.slice(1).replace(/\s/g, '')
		: trimmed;
	const hexNorm = normalizeHexInput(hexSource);
	const hexBody = hexNorm.startsWith('#') ? hexNorm.slice(1) : hexNorm;
	// tinycolor treats 3- and 4-digit #hex as shorthand/hex8 (e.g. #70c → #7700cc).
	// During typing that corrupts longer hex (e.g. #70ca9e → #7700cca9e). Only
	// canonicalize complete 6- or 8-digit hex bodies.
	if (
		hexBody.length > 0 &&
		/^[0-9a-f]+$/i.test(hexBody) &&
		hexBody.length !== 6 &&
		hexBody.length !== 8
	) {
		const lower = hexBody.toLowerCase();
		// Do not prepend "#" unless the user typed it: a lone "c" is the start of
		// "currentColor", not "#c" hex.
		return trimmed.startsWith('#') ? '#' + lower : lower;
	}
	const hexTc = tinycolor(hexNorm);
	if (hexTc.isValid()) {
		const fmt = hexTc.getFormat();
		if (fmt === 'hex' || fmt === 'hex8') {
			if (fmt === 'hex8' && hexTc.getAlpha() < 1) {
				return hexTc.toHex8String().toLowerCase();
			}
			return hexTc.toHexString().toLowerCase();
		}
	}

	if (RGBA_MATCHER.exec(trimmed) || HSLA_MATCHER.exec(trimmed)) {
		return trimmed.replace(/\s+/g, ' ').trim();
	}

	return trimmed;
}

/**
 * Finalize color input on blur or popover close (e.g. "#ccc" → "#cccccc").
 */
export function finalizeColorString(value: string): string {
	return valueCleanupColorString(value, { finalize: true });
}

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue, isValid } from '@blockera/controls';

/**
 * Persisted `border` on each repeater item / theme.json preset: width, style, color only.
 * Same shape as `BorderControl` context value.
 */
export type BorderPresetStoredSide = {
	width: string;
	style: string;
	color: string | Record<string, unknown>;
};

export type BorderBoxPreset = {
	slug: string;
	name: string;
	border: BorderPresetStoredSide;
};

/**
 * Border box presets: `settings.border.presets.{theme|default|custom}`.
 * `settings.custom` is reserved for CSS custom properties in theme.json — do not store presets there.
 */

export function getDefaultStoredBorderSide(): BorderPresetStoredSide {
	return { width: '', style: '', color: '' };
}

function isValidStoredColorField(c: unknown): boolean {
	return (
		typeof c === 'string' ||
		(c !== null && typeof c === 'object' && !Array.isArray(c))
	);
}

/**
 * True when `border` matches the persisted `{ width, style, color }` shape.
 */
export function isStoredBorderSide(o: unknown): o is BorderPresetStoredSide {
	if (!o || typeof o !== 'object' || Array.isArray(o)) {
		return false;
	}
	const x = o as Record<string, unknown>;
	if (x.type === 'all' || x.type === 'custom') {
		return false;
	}
	if (typeof x.width !== 'string' || typeof x.style !== 'string') {
		return false;
	}
	if (!('color' in x)) {
		return true;
	}
	return isValidStoredColorField(x.color);
}

function normalizeStoredSide(
	raw: BorderPresetStoredSide | Record<string, unknown>
): BorderPresetStoredSide {
	const x = raw as Record<string, unknown>;
	let color: string | Record<string, unknown> = '';
	const c = x.color;
	if (c !== undefined && c !== null && isValidStoredColorField(c)) {
		color = c as string | Record<string, unknown>;
	}
	return {
		width: String(x.width ?? ''),
		style: String(x.style ?? ''),
		color,
	};
}

/**
 * Coerce unknown input to a stored border triple (default when invalid).
 */
export function coerceBorderPresetSide(raw: unknown): BorderPresetStoredSide {
	if (isStoredBorderSide(raw)) {
		return normalizeStoredSide(raw);
	}
	return getDefaultStoredBorderSide();
}

/**
 * Keep border box presets: requires slug and name; border must be the flat triple or defaults.
 */
export function sanitizeBorderBoxPresets(presets: unknown): BorderBoxPreset[] {
	if (!Array.isArray(presets)) {
		return [];
	}
	const out: BorderBoxPreset[] = [];
	for (const item of presets) {
		if (!item || typeof item !== 'object') {
			continue;
		}
		const o = item as Record<string, unknown>;
		if (typeof o.slug !== 'string' || typeof o.name !== 'string') {
			continue;
		}
		out.push({
			slug: o.slug,
			name: o.name,
			border: coerceBorderPresetSide(o.border),
		});
	}
	return out;
}

/**
 * Resolved CSS color string for labels (supports value-addons).
 */
export function resolveBorderColorString(
	color: string | Record<string, unknown> | undefined
): string {
	if (color === undefined || color === '') {
		return '';
	}
	if (typeof color === 'string') {
		return color;
	}
	if (isValid(color)) {
		return String(getValueAddonRealValue(color) ?? '');
	}
	return '';
}

/**
 * Plain-language summary for `title` / tooltips (includes full color text).
 */
export function getBorderPresetAccessibilityDescription(
	border: BorderPresetStoredSide | undefined
): string {
	if (!border) {
		return '';
	}
	const side = coerceBorderPresetSide(border);
	const w = String(side.width ?? '').trim();
	const st = String(side.style ?? '').trim();
	const c = resolveBorderColorString(
		side.color as string | Record<string, unknown> | undefined
	);
	const parts: string[] = [];
	if (w) {
		parts.push(w);
	}
	if (st) {
		parts.push(st);
	}
	if (c) {
		parts.push(c);
	}
	return parts.join(' · ');
}

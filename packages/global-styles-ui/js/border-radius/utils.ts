/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * `settings.border` keys allowed by WordPress core theme.json schema.
 *
 * @see WP_Theme_JSON::VALID_SETTINGS in class-wp-theme-json.php
 */
export const VALID_BORDER_SETTING_KEYS = [
	'color',
	'radius',
	'radiusSizes',
	'style',
	'width',
] as const;

export type BorderRadiusSizePreset = {
	slug: string;
	name: string;
	size: string | number;
};

/**
 * Keep only preset entries that match the theme.json border.radiusSizes item shape.
 * Unknown or malformed entries are ignored so invalid theme data does not break the UI.
 */
export function sanitizeRadiusSizes(
	presets: unknown
): BorderRadiusSizePreset[] {
	if (!Array.isArray(presets)) {
		return [];
	}
	return presets.filter(isValidRadiusSizePreset);
}

function isValidRadiusSizePreset(
	item: unknown
): item is BorderRadiusSizePreset {
	if (!item || typeof item !== 'object') {
		return false;
	}
	const o = item as Record<string, unknown>;
	return (
		typeof o.slug === 'string' &&
		typeof o.name === 'string' &&
		(typeof o.size === 'string' || typeof o.size === 'number')
	);
}

/**
 * Value shape for `BorderRadiusControl` (matches @blockera/controls).
 */
export type BorderRadiusControlValue = {
	type: 'all' | 'custom';
	all?: string;
	topLeft?: string;
	topRight?: string;
	bottomLeft?: string;
	bottomRight?: string;
};

/**
 * Map theme.json `size` to `BorderRadiusControl` state. Four whitespace-separated
 * lengths map to per-corner mode (compatible with CSS border-radius shorthand order).
 */
export function parseRadiusSizeToControlValue(
	size: string | number
): BorderRadiusControlValue {
	const s = String(size ?? '').trim();
	if (!s) {
		return { type: 'all', all: '' };
	}
	const parts = s.split(/\s+/).filter(Boolean);
	if (parts.length === 4) {
		return {
			type: 'custom',
			topLeft: parts[0],
			topRight: parts[1],
			bottomRight: parts[2],
			bottomLeft: parts[3],
		};
	}
	return { type: 'all', all: s };
}

/**
 * Persist control state to `border.radiusSizes[].size` (valid CSS for presets).
 */
export function serializeControlValueToRadiusSize(
	value: BorderRadiusControlValue
): string | number {
	if (value.type === 'all') {
		return value.all ?? '';
	}
	const tl = value.topLeft ?? '';
	const tr = value.topRight ?? '';
	const br = value.bottomRight ?? '';
	const bl = value.bottomLeft ?? '';
	return [tl, tr, br, bl].map((x) => x || '0').join(' ');
}

/**
 * CSS `border-radius` value for preview (matches saved `size` semantics).
 */
export function radiusSizeToPreviewCss(size: string | number): string {
	const parsed = parseRadiusSizeToControlValue(size);
	if (parsed.type === 'all') {
		return (parsed.all ?? '').trim() || '0';
	}
	const tl = parsed.topLeft ?? '0';
	const tr = parsed.topRight ?? '0';
	const br = parsed.bottomRight ?? '0';
	const bl = parsed.bottomLeft ?? '0';
	return [tl, tr, br, bl].map((x) => String(x).trim() || '0').join(' ');
}

/**
 * One-line label for repeater header (middle-dot separators for corners).
 */
export function formatRadiusPresetHeaderValue(
	size: string | number | undefined
): string {
	const raw = String(size ?? '').trim();
	if (!raw) {
		return '';
	}
	const parsed = parseRadiusSizeToControlValue(size);
	if (parsed.type === 'all') {
		return (parsed.all ?? '').trim();
	}
	const tl = String(parsed.topLeft ?? '0').trim();
	const tr = String(parsed.topRight ?? '0').trim();
	const br = String(parsed.bottomRight ?? '0').trim();
	const bl = String(parsed.bottomLeft ?? '0').trim();
	return sprintf(
		/* translators: %1$s: top-left corner radius. %2$s: top-right. %3$s: bottom-right. %4$s: bottom-left. */
		__('%1$s · %2$s · %3$s · %4$s', 'blockera'),
		tl,
		tr,
		br,
		bl
	);
}

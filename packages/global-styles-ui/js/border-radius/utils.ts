/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';
import { normalizePresetSize } from '@blockera/data';

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
	return presets.filter(isValidRadiusSizePreset).map((item) => ({
		...item,
		size: normalizePresetSize(item.size),
	}));
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
 * Resolved preset `size` for UI (repeater header, empty preview check).
 * Unwraps value-addon objects so we never treat them as empty via `String(object)`.
 */
export function radiusPresetSizeToString(
	size: string | number | undefined
): string {
	const v = getValueAddonRealValue(size);
	return (typeof v === 'number' ? String(v) : String(v ?? '')).trim();
}

/**
 * CSS `border-radius` for preview from the stored preset `size`.
 */
export function radiusSizeToPreviewCss(size: string | number): string {
	return radiusPresetSizeToString(size) || '0';
}

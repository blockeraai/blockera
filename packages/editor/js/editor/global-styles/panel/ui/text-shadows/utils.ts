/**
 * WordPress theme.json text shadow preset (settings.textShadow.presets).
 * Same shape as box shadow presets: slug, name, and `shadow` holding the CSS value
 * (here a `text-shadow` value, not `box-shadow`).
 */
export type WpTextShadowPreset = {
	slug: string;
	name: string;
	/** CSS `text-shadow` value stored in theme.json */
	shadow: string;
};

export function sanitizeTextShadowPresets(raw: unknown): WpTextShadowPreset[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	return raw
		.filter(
			(p): p is Record<string, unknown> =>
				p !== null && typeof p === 'object'
		)
		.map((p) => ({
			slug: String(p.slug ?? '').trim(),
			name: String(p.name ?? '').trim(),
			shadow: String(p.shadow ?? '').trim(),
		}))
		.filter((p) => p.slug && p.name);
}

export function truncateTextShadowCssForHeader(
	css: string,
	maxLen = 40
): string {
	const s = String(css ?? '').trim();
	if (!s) {
		return '';
	}
	if (s.length <= maxLen) {
		return s;
	}
	return `${s.slice(0, Math.max(0, maxLen - 1))}…`;
}

export function getTextShadowPresetAccessibilityDescription(
	preset: WpTextShadowPreset | undefined
): string {
	if (!preset) {
		return '';
	}
	const parts: string[] = [];
	if (preset.name) {
		parts.push(preset.name);
	}
	if (preset.shadow) {
		parts.push(preset.shadow);
	}
	return parts.join(' — ');
}

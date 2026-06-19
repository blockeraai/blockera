/**
 * Repeater object keys often do not match preset slugs; resolve the real item id for updates.
 */
export function findRepeaterItemIdBySlug(
	repeaterItems: Record<string, { slug?: string }> | undefined,
	targetSlug: string
): string | number | null {
	if (!repeaterItems) {
		return null;
	}
	for (const [id, row] of Object.entries(repeaterItems)) {
		if (String(row?.slug ?? '') === targetSlug) {
			return id;
		}
	}
	return null;
}

function presetTaxonomyInterfaceSizeRaw(
	item: Record<string, unknown>
): string | undefined {
	const direct =
		item['interface-size'] ??
		(item.interfaceSize as string | number | undefined);
	if (
		direct !== undefined &&
		direct !== null &&
		String(direct).trim() !== ''
	) {
		return String(direct).trim();
	}

	const meta = item.meta;
	if (
		meta !== null &&
		meta !== undefined &&
		typeof meta === 'object' &&
		!Array.isArray(meta)
	) {
		const m = meta as Record<string, unknown>;
		const mv =
			m['interface-size'] ??
			(m.interfaceSize as string | number | undefined);
		if (mv !== undefined && mv !== null && String(mv).trim() !== '') {
			return String(mv).trim();
		}
	}

	return undefined;
}

/**
 * Preset variable meta may set `"interface-size": "small"` (or camelCase) so taxonomy rows use half width (two per row).
 */
export function isPresetTaxonomyInterfaceSizeSmall(
	item: Record<string, unknown>
): boolean {
	const raw = presetTaxonomyInterfaceSizeRaw(item);
	return raw !== undefined && raw.toLowerCase() === 'small';
}

export type PresetRepeaterItemSize = 'full' | 'small';

/** Layout size for flat/simple repeater rows with `meta.interface-size: small`. */
export function resolvePresetRepeaterItemSize(
	item: Record<string, unknown>
): PresetRepeaterItemSize {
	return isPresetTaxonomyInterfaceSizeSmall(item) ? 'small' : 'full';
}

/** All presets under a taxonomy category (direct rows + sub-section rows). */
export function collectTaxonomyCategoryPresets<
	T extends Record<string, unknown>,
>(category: { directPresets: T[]; subSections: { presets: T[] }[] }): T[] {
	const out: T[] = [];
	for (const preset of category.directPresets) {
		out.push(preset);
	}
	for (const sub of category.subSections) {
		for (const preset of sub.presets) {
			out.push(preset);
		}
	}
	return out;
}

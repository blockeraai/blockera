import { isShadePaletteColor } from '../../colors/utils';
import { getPresetMeta } from './taxonomy-meta';

export type ParsedPresetNameTaxonomy = {
	groupName: string;
	categoryName?: string;
	subCategoryName?: string;
	leafName: string;
};

export type TaxonomyNameSource = {
	basePresetsBySlug?: Map<string, Record<string, unknown>>;
};

/**
 * Splits preset `name` on `/`, trims each segment, drops empties.
 */
export function splitPresetNameTaxonomySegments(name: string): string[] {
	const out: string[] = [];
	for (const part of name.split('/')) {
		const trimmed = part.trim();
		if (trimmed !== '') {
			out.push(trimmed);
		}
	}
	return out;
}

export function slugifyTaxonomySegment(label: string): string {
	return label
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

export function presetsBySlugMap(
	presets?: Record<string, unknown>[]
): Map<string, Record<string, unknown>> | undefined {
	if (!presets?.length) {
		return undefined;
	}
	const map = new Map<string, Record<string, unknown>>();
	for (const preset of presets) {
		const slug = String(preset.slug ?? '');
		if (slug !== '') {
			map.set(slug, preset);
		}
	}
	return map;
}

/**
 * Name used for taxonomy grouping: preset `name`, or base theme palette `name` by slug
 * when the edited row still has a flat label (user global styles over theme.json).
 */
export function resolvePresetTaxonomyName(
	preset: Record<string, unknown>,
	source?: TaxonomyNameSource
): string {
	const name = preset.name;
	if (
		typeof name === 'string' &&
		splitPresetNameTaxonomySegments(name).length >= 2
	) {
		return name;
	}
	const slug = String(preset.slug ?? '');
	const baseName = source?.basePresetsBySlug?.get(slug)?.name;
	if (
		typeof baseName === 'string' &&
		splitPresetNameTaxonomySegments(baseName).length >= 2
	) {
		return baseName;
	}
	return typeof name === 'string' ? name : '';
}

/**
 * Maps normalized name segments to group / category / sub-category / leaf.
 * 2 segments → group + direct preset; 3 → group + category + preset; 4+ → group + category + sub + preset.
 */
export function parsePresetNameTaxonomy(
	name: string
): ParsedPresetNameTaxonomy | undefined {
	const segments = splitPresetNameTaxonomySegments(name);
	if (segments.length < 2) {
		return undefined;
	}
	const groupName = segments[0];
	const leafName = segments[segments.length - 1];
	if (segments.length === 2) {
		return { groupName, leafName };
	}
	if (segments.length === 3) {
		return {
			groupName,
			categoryName: segments[1],
			leafName,
		};
	}
	return {
		groupName,
		categoryName: segments[1],
		subCategoryName: segments[2],
		leafName,
	};
}

export function isNameBasedTaxonomyPreset(
	preset: Record<string, unknown>,
	source?: TaxonomyNameSource,
	excludePreset?: (preset: Record<string, unknown>) => boolean
): boolean {
	const meta = getPresetMeta(preset);
	if (meta?.renderRepeaterItem === false) {
		return false;
	}
	if (excludePreset?.(preset)) {
		return false;
	}
	if (
		!excludePreset &&
		isShadePaletteColor(preset as Parameters<typeof isShadePaletteColor>[0])
	) {
		return false;
	}
	const taxonomyName = resolvePresetTaxonomyName(preset, source);
	if (taxonomyName === '') {
		return false;
	}
	const segmentCount = splitPresetNameTaxonomySegments(taxonomyName).length;
	return segmentCount >= 2;
}

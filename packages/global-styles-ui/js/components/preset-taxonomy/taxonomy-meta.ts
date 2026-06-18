import {
	parsePresetNameTaxonomy,
	resolvePresetTaxonomyName,
	type TaxonomyNameSource,
} from './parse-preset-name-taxonomy';

export function getPresetMeta(
	preset: Record<string, unknown>
): Record<string, unknown> | undefined {
	const m = preset.meta;
	return m !== null && typeof m === 'object'
		? (m as Record<string, unknown>)
		: undefined;
}

/**
 * Fills missing preset `meta` from the base theme row (e.g. `interface-size` when user styles omit meta).
 */
export function mergePresetTaxonomyMetaFromBase<
	T extends Record<string, unknown>,
>(preset: T, source?: TaxonomyNameSource): T {
	const slug = String(preset.slug ?? '');
	if (slug === '') {
		return preset;
	}
	const base = source?.basePresetsBySlug?.get(slug);
	if (!base) {
		return preset;
	}
	const baseMeta = getPresetMeta(base);
	if (!baseMeta) {
		return preset;
	}
	const presetMeta = getPresetMeta(preset);
	if (!presetMeta) {
		return { ...preset, meta: { ...baseMeta } } as T;
	}
	return { ...preset, meta: { ...baseMeta, ...presetMeta } } as T;
}

/**
 * Taxonomy row labels use the leaf segment from a `/`-delimited name (base theme fallback when the stored name is flat).
 */
export function resolvePresetTaxonomyDisplayName(
	preset: Record<string, unknown>,
	source?: TaxonomyNameSource
): string {
	const taxonomyName = resolvePresetTaxonomyName(preset, source);
	if (taxonomyName !== '') {
		const parsed = parsePresetNameTaxonomy(taxonomyName);
		if (parsed?.leafName) {
			return parsed.leafName;
		}
	}
	const name = preset.name;
	return typeof name === 'string' ? name : '';
}

/**
 * Full taxonomy path for the edit form (`Text/Primary/On Brand`), preferring base theme names when the stored row is flat.
 */
export function resolvePresetTaxonomyEditName(
	preset: Record<string, unknown>,
	source?: TaxonomyNameSource
): string {
	const taxonomyName = resolvePresetTaxonomyName(preset, source);
	if (taxonomyName !== '') {
		return taxonomyName;
	}
	const name = preset.name;
	return typeof name === 'string' ? name : '';
}

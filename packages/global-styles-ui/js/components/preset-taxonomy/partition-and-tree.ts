import type { TaxonomyDeclarations, TaxonomyGroupBranch } from './types';
import {
	getPresetMeta,
	resolveCategoryShowPreview,
	resolveDeclaredCategorySlug,
} from './taxonomy-meta';

function presetSlug(preset: Record<string, unknown>): string {
	return String(preset.slug ?? '');
}

export function isPresetInTaxonomyBranch(
	preset: Record<string, unknown>,
	declarations: TaxonomyDeclarations
): boolean {
	if (!declarations.groups.length) {
		return false;
	}
	const meta = getPresetMeta(preset);
	const g = meta?.group;
	if (typeof g !== 'string' || g === '') {
		return false;
	}
	const groupSlugs = new Set(declarations.groups.map((x) => x.slug));
	return groupSlugs.has(g);
}

export function partitionPresetsForTaxonomyUi<
	T extends Record<string, unknown>,
>(
	presets: T[],
	declarations: TaxonomyDeclarations
): {
	taxonomyPresets: T[];
	simplePresets: T[];
	taxonomySlugSet: Set<string>;
} {
	if (!declarations.groups.length) {
		return {
			taxonomyPresets: [],
			simplePresets: presets,
			taxonomySlugSet: new Set(),
		};
	}
	const taxonomyPresets = presets.filter((p) =>
		isPresetInTaxonomyBranch(p, declarations)
	);
	const taxonomySlugSet = new Set(taxonomyPresets.map((p) => presetSlug(p)));
	const simplePresets = presets.filter(
		(p) => !taxonomySlugSet.has(presetSlug(p)) && !p.hasOwnProperty('meta')
	);
	return { taxonomyPresets, simplePresets, taxonomySlugSet };
}

export function buildTaxonomyTree<T extends Record<string, unknown>>(
	taxonomyPresets: T[],
	declarations: TaxonomyDeclarations
): TaxonomyGroupBranch<T>[] {
	const branches: TaxonomyGroupBranch<T>[] = [];

	for (const groupDef of declarations.groups) {
		const members = taxonomyPresets.filter(
			(p) => String(getPresetMeta(p)?.group ?? '') === groupDef.slug
		);
		if (!members.length) {
			continue;
		}

		const assigned = new Set<string>();

		const categories: TaxonomyGroupBranch<T>['categories'] = [];

		for (const catDef of declarations.categories) {
			const catMembers = members.filter(
				(p) =>
					resolveDeclaredCategorySlug(
						getPresetMeta(p)?.category,
						declarations.categories
					) === catDef.slug
			);
			if (!catMembers.length) {
				continue;
			}

			const directPresets = catMembers.filter(
				(p) => !getPresetMeta(p)?.['sub-category']
			);
			for (const p of catMembers) {
				assigned.add(presetSlug(p));
			}

			const subSlugSet = new Set<string>();
			for (const p of catMembers) {
				const sc = getPresetMeta(p)?.['sub-category'];
				if (typeof sc === 'string' && sc !== '') {
					subSlugSet.add(sc);
				}
			}

			const subSections = [...subSlugSet].map((subSlug) => ({
				slug: subSlug,
				name:
					declarations.categories.find((c) => c.slug === subSlug)
						?.name ?? subSlug,
				showPreview: resolveCategoryShowPreview(
					catDef.slug,
					subSlug,
					declarations.categories
				),
				presets: catMembers.filter(
					(p) =>
						String(getPresetMeta(p)?.['sub-category'] ?? '') ===
						subSlug
				),
			}));

			categories.push({
				slug: catDef.slug,
				name: catDef.name,
				showPreview: catDef['show-preview'] === true,
				directPresets,
				subSections,
			});
		}

		const directPresets = members.filter(
			(p) => !assigned.has(presetSlug(p))
		);

		branches.push({
			slug: groupDef.slug,
			name: groupDef.name,
			directPresets,
			categories,
		});
	}

	return branches;
}

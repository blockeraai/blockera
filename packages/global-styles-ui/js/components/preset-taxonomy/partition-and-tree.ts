import type {
	TaxonomyCategoryChildRef,
	TaxonomyGroupBranch,
	TaxonomyGroupChildRef,
} from './types';
import {
	isNameBasedTaxonomyPreset,
	parsePresetNameTaxonomy,
	presetsBySlugMap,
	resolvePresetTaxonomyName,
	slugifyTaxonomySegment,
	splitPresetNameTaxonomySegments,
	type TaxonomyNameSource,
} from './parse-preset-name-taxonomy';
import { mergePresetTaxonomyMetaFromBase } from './taxonomy-meta';

function presetSlug(preset: Record<string, unknown>): string {
	return String(preset.slug ?? '');
}

/** Overlay canonical row state (e.g. `hasVariations` from the repeater model) onto tree nodes by slug. */
function mergePresetWithCanonical<T extends Record<string, unknown>>(
	canonicalBySlug: Map<string, T> | undefined,
	preset: T
): T {
	if (!canonicalBySlug?.size) {
		return preset;
	}
	const slug = presetSlug(preset);
	const row = canonicalBySlug.get(slug);
	if (!row) {
		return preset;
	}
	return { ...preset, ...row } as T;
}

function canonicalPresetMap<T extends Record<string, unknown>>(
	canonicalPresets?: T[]
): Map<string, T> | undefined {
	if (!canonicalPresets?.length) {
		return undefined;
	}
	return new Map(canonicalPresets.map((p) => [presetSlug(p), p]));
}

export function isPresetInTaxonomyBranch(
	preset: Record<string, unknown>,
	source?: TaxonomyNameSource
): boolean {
	return isNameBasedTaxonomyPreset(preset, source);
}

export function partitionPresetsForTaxonomyUi<
	T extends Record<string, unknown>,
>(
	presets: T[],
	/** Base theme palette rows — used to resolve `/` taxonomy names when user styles keep flat labels. */
	basePresets?: T[]
): {
	taxonomyPresets: T[];
	simplePresets: T[];
	taxonomySlugSet: Set<string>;
} {
	const source: TaxonomyNameSource = {
		basePresetsBySlug: presetsBySlugMap(basePresets),
	};
	const taxonomyPresets = presets.filter((p) =>
		isPresetInTaxonomyBranch(p, source)
	);
	const taxonomySlugSet = new Set(taxonomyPresets.map((p) => presetSlug(p)));
	const simplePresets = presets.filter(
		(p) => !taxonomySlugSet.has(presetSlug(p))
	);
	return { taxonomyPresets, simplePresets, taxonomySlugSet };
}

type CategoryBucket<T> = TaxonomyGroupBranch<T>['categories'][number];
type SubSectionBucket<T> = CategoryBucket<T>['subSections'][number];

function appendUniqueChildRef<TRef extends { kind: string; slug: string }>(
	order: TRef[],
	seen: Set<string>,
	ref: TRef
): void {
	const key = `${ref.kind}:${ref.slug}`;
	if (seen.has(key)) {
		return;
	}
	seen.add(key);
	order.push(ref);
}

function removeGroupPresetChildRef(
	childOrder: TaxonomyGroupChildRef[],
	presetSlugValue: string
): void {
	for (let i = childOrder.length - 1; i >= 0; i--) {
		const ref = childOrder[i];
		if (ref.kind === 'preset' && ref.slug === presetSlugValue) {
			childOrder.splice(i, 1);
			return;
		}
	}
}

/** After promotion, keep category `childOrder` aligned so the UI renders every direct preset. */
function prependCategoryPresetChildRef(
	category: CategoryBucket<Record<string, unknown>>,
	presetSlugValue: string
): void {
	const presetRef: TaxonomyCategoryChildRef = {
		kind: 'preset',
		slug: presetSlugValue,
	};
	const order = category.childOrder ?? [];
	const withoutDup = order.filter(
		(ref) => !(ref.kind === 'preset' && ref.slug === presetSlugValue)
	);
	category.childOrder = [presetRef, ...withoutDup];
}

function getOrCreateGroup<T extends Record<string, unknown>>(
	groupOrder: string[],
	groups: Map<string, TaxonomyGroupBranch<T>>,
	groupName: string
): TaxonomyGroupBranch<T> {
	const groupSlug = slugifyTaxonomySegment(groupName);
	let group = groups.get(groupSlug);
	if (!group) {
		group = {
			slug: groupSlug,
			name: groupName,
			directPresets: [],
			categories: [],
			childOrder: [],
		};
		groups.set(groupSlug, group);
		groupOrder.push(groupSlug);
	}
	return group;
}

function getOrCreateCategory<T extends Record<string, unknown>>(
	categoryOrder: Map<string, string[]>,
	groupSlug: string,
	categories: CategoryBucket<T>[],
	categoryName: string
): { category: CategoryBucket<T>; isNew: boolean } {
	const catSlug = slugifyTaxonomySegment(categoryName);
	const order = categoryOrder.get(groupSlug) ?? [];
	let category = categories.find((c) => c.slug === catSlug);
	let isNew = false;
	if (!category) {
		isNew = true;
		category = {
			slug: catSlug,
			name: categoryName,
			showPreview: false,
			directPresets: [],
			subSections: [],
			childOrder: [],
		};
		categories.push(category);
		order.push(catSlug);
		categoryOrder.set(groupSlug, order);
	}
	return { category, isNew };
}

function getOrCreateSubSection<T extends Record<string, unknown>>(
	subOrder: Map<string, string[]>,
	groupSlug: string,
	categorySlug: string,
	subSections: SubSectionBucket<T>[],
	subCategoryName: string
): { sub: SubSectionBucket<T>; isNew: boolean } {
	const subSlug = slugifyTaxonomySegment(subCategoryName);
	const orderKey = `${groupSlug}|${categorySlug}`;
	const order = subOrder.get(orderKey) ?? [];
	let sub = subSections.find((s) => s.slug === subSlug);
	let isNew = false;
	if (!sub) {
		isNew = true;
		sub = {
			slug: subSlug,
			name: subCategoryName,
			showPreview: false,
			presets: [],
		};
		subSections.push(sub);
		order.push(subSlug);
		subOrder.set(orderKey, order);
	}
	return { sub, isNew };
}

export function buildTaxonomyTree<T extends Record<string, unknown>>(
	taxonomyPresets: T[],
	/** When set (e.g. main repeater value), merged into each tree preset by slug so fields like `hasVariations` match the row model. */
	canonicalPresets?: T[],
	basePresets?: T[]
): TaxonomyGroupBranch<T>[] {
	const canonicalBySlug = canonicalPresetMap(canonicalPresets);
	const source: TaxonomyNameSource = {
		basePresetsBySlug: presetsBySlugMap(basePresets),
	};
	const groups = new Map<string, TaxonomyGroupBranch<T>>();
	const groupOrder: string[] = [];
	const categoryOrder = new Map<string, string[]>();
	const subOrder = new Map<string, string[]>();
	const groupChildSeen = new Map<string, Set<string>>();
	const categoryChildSeen = new Map<string, Set<string>>();

	for (const preset of taxonomyPresets) {
		const taxonomyName = resolvePresetTaxonomyName(preset, source);
		if (taxonomyName === '') {
			continue;
		}
		const parsed = parsePresetNameTaxonomy(taxonomyName);
		if (!parsed) {
			continue;
		}
		const merged = mergePresetTaxonomyMetaFromBase(
			mergePresetWithCanonical(canonicalBySlug, preset),
			source
		);
		const segmentCount =
			splitPresetNameTaxonomySegments(taxonomyName).length;
		const group = getOrCreateGroup(groupOrder, groups, parsed.groupName);

		if (segmentCount === 2) {
			group.directPresets.push(merged);
			const groupSeen = groupChildSeen.get(group.slug) ?? new Set();
			if (!groupChildSeen.has(group.slug)) {
				groupChildSeen.set(group.slug, groupSeen);
			}
			appendUniqueChildRef(group.childOrder, groupSeen, {
				kind: 'preset',
				slug: presetSlug(merged),
			});
			continue;
		}

		const categoryName = parsed.categoryName;
		if (!categoryName) {
			continue;
		}
		const { category, isNew: isNewCategory } = getOrCreateCategory(
			categoryOrder,
			group.slug,
			group.categories,
			categoryName
		);
		if (isNewCategory) {
			const groupSeen = groupChildSeen.get(group.slug) ?? new Set();
			if (!groupChildSeen.has(group.slug)) {
				groupChildSeen.set(group.slug, groupSeen);
			}
			appendUniqueChildRef(group.childOrder, groupSeen, {
				kind: 'category',
				slug: category.slug,
			});
		}

		if (segmentCount === 3) {
			category.directPresets.push(merged);
			const categoryKey = `${group.slug}|${category.slug}`;
			const catSeen = categoryChildSeen.get(categoryKey) ?? new Set();
			if (!categoryChildSeen.has(categoryKey)) {
				categoryChildSeen.set(categoryKey, catSeen);
			}
			appendUniqueChildRef(category.childOrder, catSeen, {
				kind: 'preset',
				slug: presetSlug(merged),
			});
			continue;
		}

		const subCategoryName = parsed.subCategoryName;
		if (!subCategoryName) {
			continue;
		}
		const { sub, isNew: isNewSub } = getOrCreateSubSection(
			subOrder,
			group.slug,
			category.slug,
			category.subSections,
			subCategoryName
		);
		if (isNewSub) {
			const categoryKey = `${group.slug}|${category.slug}`;
			const catSeen = categoryChildSeen.get(categoryKey) ?? new Set();
			if (!categoryChildSeen.has(categoryKey)) {
				categoryChildSeen.set(categoryKey, catSeen);
			}
			appendUniqueChildRef(category.childOrder, catSeen, {
				kind: 'sub',
				slug: sub.slug,
			});
		}
		sub.presets.push(merged);
	}

	// Re-order categories and sub-sections by first encounter in palette walk.
	for (const groupSlug of groupOrder) {
		const group = groups.get(groupSlug);
		if (!group) {
			continue;
		}
		const catSlugs = categoryOrder.get(groupSlug);
		if (catSlugs?.length) {
			const bySlug = new Map(group.categories.map((c) => [c.slug, c]));
			group.categories = catSlugs
				.map((slug) => bySlug.get(slug))
				.filter((c): c is CategoryBucket<T> => c !== undefined);
		}
		for (const category of group.categories) {
			const orderKey = `${groupSlug}|${category.slug}`;
			const subSlugs = subOrder.get(orderKey);
			if (subSlugs?.length) {
				const bySlug = new Map(
					category.subSections.map((s) => [s.slug, s])
				);
				category.subSections = subSlugs
					.map((slug) => bySlug.get(slug))
					.filter((s): s is SubSectionBucket<T> => s !== undefined);
			}
		}
	}

	const tree = groupOrder
		.map((slug) => groups.get(slug))
		.filter((g): g is TaxonomyGroupBranch<T> => g !== undefined);

	// When a group has both `Group/Leaf` (2 segments) and `Group/Leaf/…` (3+ segments),
	// keep the leaf preset inside the matching category instead of duplicating it at group level.
	for (const group of tree) {
		promoteDirectPresetsIntoMatchingCategories(group, source);
	}

	return tree;
}

/**
 * Moves `Group/Category` direct presets into an existing `Category` bucket when deeper
 * paths already created that category (e.g. Status/Success + Status/Success/Border).
 */
function promoteDirectPresetsIntoMatchingCategories<
	T extends Record<string, unknown>,
>(group: TaxonomyGroupBranch<T>, source: TaxonomyNameSource): void {
	if (!group.directPresets.length || !group.categories.length) {
		return;
	}
	const categoryBySlug = new Map(
		group.categories.map((category) => [category.slug, category])
	);
	const remainingDirect: T[] = [];
	for (const preset of group.directPresets) {
		const taxonomyName = resolvePresetTaxonomyName(preset, source);
		const segments = splitPresetNameTaxonomySegments(taxonomyName);
		if (segments.length !== 2) {
			remainingDirect.push(preset);
			continue;
		}
		const categorySlug = slugifyTaxonomySegment(segments[1]);
		const category = categoryBySlug.get(categorySlug);
		if (!category) {
			remainingDirect.push(preset);
			continue;
		}
		category.directPresets.unshift(preset);
		prependCategoryPresetChildRef(category, presetSlug(preset));
		removeGroupPresetChildRef(group.childOrder, presetSlug(preset));
	}
	group.directPresets = remainingDirect;
}

import type { TaxonomyCategoryDeclaration } from './types';

export function getPresetMeta(
	preset: Record<string, unknown>
): Record<string, unknown> | undefined {
	const m = preset.meta;
	return m !== null && typeof m === 'object'
		? (m as Record<string, unknown>)
		: undefined;
}

/**
 * Maps palette meta.category "information" to declared slug "info" (Twenty Twenty-Five).
 */
export function resolveDeclaredCategorySlug(
	rawCategory: unknown,
	categories: TaxonomyCategoryDeclaration[]
): string | undefined {
	if (typeof rawCategory !== 'string' || rawCategory === '') {
		return undefined;
	}
	const slugs = new Set(categories.map((c) => c.slug));
	if (slugs.has(rawCategory)) {
		return rawCategory;
	}
	if (rawCategory === 'information' && slugs.has('info')) {
		return 'info';
	}
	return undefined;
}

export function resolveCategoryShowPreview(
	parentCategorySlug: string,
	subCategorySlug: string | undefined,
	declaredCategories: TaxonomyCategoryDeclaration[]
): boolean {
	if (subCategorySlug) {
		const sub = declaredCategories.find((c) => c.slug === subCategorySlug);
		// Sub-rows never inherit parent category show-preview; only the sub-category declaration counts.
		return sub !== undefined && sub['show-preview'] === true;
	}
	const parent = declaredCategories.find(
		(c) => c.slug === parentCategorySlug
	);
	return parent?.['show-preview'] === true;
}

/**
 * Maps declarative `initial-open` / normalized `initialOpen` from settings.categories[]
 * onto accordion initial state. Returns undefined when absent so UI keeps package accordion default.
 */
export function resolveCategoryInitialOpen(
	declaration: TaxonomyCategoryDeclaration | undefined
): boolean | undefined {
	if (!declaration) {
		return undefined;
	}
	if (typeof declaration['initial-open'] === 'boolean') {
		return declaration['initial-open'];
	}
	return undefined;
}

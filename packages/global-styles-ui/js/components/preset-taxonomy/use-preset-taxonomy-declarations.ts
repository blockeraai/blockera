import { useMemo } from '@wordpress/element';

import { useGlobalSetting } from '../../context/global-style-hooks';
import type {
	TaxonomyCategoryDeclaration,
	TaxonomyDeclarations,
	TaxonomyGroupDeclaration,
} from './types';

function normalizeGroups(raw: unknown): TaxonomyGroupDeclaration[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	const out: TaxonomyGroupDeclaration[] = [];
	for (const row of raw) {
		if (
			row !== null &&
			typeof row === 'object' &&
			typeof (row as { slug?: unknown }).slug === 'string' &&
			typeof (row as { name?: unknown }).name === 'string'
		) {
			out.push({
				slug: (row as { slug: string }).slug,
				name: (row as { name: string }).name,
			});
		}
	}
	return out;
}

function normalizeCategories(raw: unknown): TaxonomyCategoryDeclaration[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	const out: TaxonomyCategoryDeclaration[] = [];
	for (const row of raw) {
		if (
			row !== null &&
			typeof row === 'object' &&
			typeof (row as { slug?: unknown }).slug === 'string' &&
			typeof (row as { name?: unknown }).name === 'string'
		) {
			const r = row as {
				slug: string;
				name: string;
				'show-preview'?: unknown;
				'initial-open'?: unknown;
				initialOpen?: unknown;
			};
			let initialOpenKebab: boolean | undefined;
			if (typeof r['initial-open'] === 'boolean') {
				initialOpenKebab = r['initial-open'];
			} else if (typeof r.initialOpen === 'boolean') {
				initialOpenKebab = r.initialOpen;
			}
			out.push({
				slug: r.slug,
				name: r.name,
				...(typeof r['show-preview'] === 'boolean'
					? { 'show-preview': r['show-preview'] }
					: {}),
				...(initialOpenKebab !== undefined
					? { 'initial-open': initialOpenKebab }
					: {}),
			});
		}
	}
	return out;
}

/**
 * Reads declarative taxonomy from merged global styles settings (e.g. settings.color.groups).
 *
 * @param settingsFeaturePath First segment under settings: `color`, `spacing`, `typography`, …
 */
export function usePresetTaxonomyDeclarations(
	settingsFeaturePath: string
): TaxonomyDeclarations {
	const [groupsRaw] = useGlobalSetting(`${settingsFeaturePath}.groups`, '');
	const [categoriesRaw] = useGlobalSetting(
		`${settingsFeaturePath}.categories`,
		''
	);

	return useMemo(
		(): TaxonomyDeclarations => ({
			groups: normalizeGroups(groupsRaw),
			categories: normalizeCategories(categoriesRaw),
		}),
		[groupsRaw, categoriesRaw]
	);
}

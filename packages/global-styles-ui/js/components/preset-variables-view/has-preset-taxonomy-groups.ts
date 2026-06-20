import { partitionPresetsForTaxonomyUi } from '../preset-taxonomy/partition-and-tree';

export function hasPresetTaxonomyGroups<T extends Record<string, unknown>>(
	items: T[],
	baseItems?: T[]
): boolean {
	if (!items.length) {
		return false;
	}
	return (
		partitionPresetsForTaxonomyUi(items, baseItems).taxonomyPresets.length >
		0
	);
}

export function hasPresetTaxonomyGroupsInOriginSets<
	T extends Record<string, unknown>,
>(originSets: Array<{ items: T[]; baseItems?: T[] }>): boolean {
	for (const set of originSets) {
		if (hasPresetTaxonomyGroups(set.items, set.baseItems)) {
			return true;
		}
	}
	return false;
}

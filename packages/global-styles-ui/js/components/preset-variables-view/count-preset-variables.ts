import {
	normalizeVariablePickerSearchQuery,
	variablePickerItemMatchesSearch,
} from '@blockera/controls';

import { filterMainPaletteColors } from '../../colors/utils';

export type PresetVariablesOriginSet<T extends Record<string, unknown>> = {
	items: T[];
	baseItems?: T[];
	/** When `color`, shade rows are excluded from the count. */
	presetKind?: 'color' | 'default';
};

function getCountablePresetItems<T extends Record<string, unknown>>(
	set: PresetVariablesOriginSet<T>
): T[] {
	const items =
		set.presetKind === 'color'
			? filterMainPaletteColors(
					set.items as Parameters<typeof filterMainPaletteColors>[0]
				)
			: set.items;

	return items as T[];
}

export function countPresetVariables<T extends Record<string, unknown>>(
	originSets: Array<PresetVariablesOriginSet<T>>,
	searchQuery?: string
): number {
	const normalizedSearch = normalizeVariablePickerSearchQuery(
		searchQuery ?? ''
	);
	let total = 0;

	for (const set of originSets) {
		const items = getCountablePresetItems(set);
		if (!normalizedSearch) {
			total += items.length;
			continue;
		}

		for (const item of items) {
			if (
				variablePickerItemMatchesSearch(
					item as Record<string, unknown>,
					normalizedSearch
				)
			) {
				total += 1;
			}
		}
	}

	return total;
}

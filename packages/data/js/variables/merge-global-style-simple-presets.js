// @flow
/**
 * Merge theme.json preset origins (default → theme → custom; same slug: later wins).
 * Aligns variable resolution with global-styles preset UIs.
 */
import type { ValueAddonReference } from '../types';
import type { VariableItem } from './types';
import { resolveCurrentThemeDisplayName } from './resolve-current-theme-name';

export const PRESET_ORIGIN_REFERENCE: ValueAddonReference = {
	type: 'preset',
};

export const CUSTOM_ORIGIN_REFERENCE: ValueAddonReference = {
	type: 'custom',
};

export function getThemeVariableReference(): ValueAddonReference {
	return {
		type: 'theme',
		theme: resolveCurrentThemeDisplayName(),
	};
}

/**
 * @param layers Ordered from lowest to highest precedence (e.g. default, then theme, then custom).
 */
export function mergeVariableItemsBySlug(
	layers: $ReadOnlyArray<{
		items: void | Array<any>,
		reference: ValueAddonReference,
	}>,
	mapRow: (item: any, reference: ValueAddonReference) => ?VariableItem
): Array<VariableItem> {
	const byId: { [string]: VariableItem } = {};

	for (const { items, reference } of layers) {
		if (!Array.isArray(items)) {
			continue;
		}

		for (const raw of items) {
			const row = mapRow(raw, reference);

			if (row && row.id) {
				byId[row.id] = row;
			}
		}
	}

	return Object.values(byId);
}

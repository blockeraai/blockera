// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import {
	STORE_NAME,
	getCustomGlobalStylePresetVariables,
	type DynamicVariableGroup,
	type VariableItem,
} from '@blockera/data';

/**
 * Internal dependencies
 */
import { getVariableCategory } from '../../helpers';
import type { VariableCategoryDetail } from '../../types';
import type { ValueAddonControlProps } from '../control/types';
import { VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER } from './var-picker-constants';

export type ResolvedVariablePickerRow = {|
	data: DynamicVariableGroup | VariableCategoryDetail,
	effectiveType: string,
|};

/**
 * Resolve store / category data for one variable type in the picker list.
 */
export function resolveVariablePickerRow(
	type: string,
	controlVariableTypes: Array<string>
): ResolvedVariablePickerRow | null {
	let data: DynamicVariableGroup | VariableCategoryDetail =
		getVariableCategory(type);

	if (data?.label === '') {
		const { getVariableGroup } = select(STORE_NAME);
		data = getVariableGroup(type);
		if (!data?.type || !controlVariableTypes.includes(data.type)) {
			return null;
		}
	}

	return {
		data,
		effectiveType: data?.type || type,
	};
}

export type SupplementalCustomSection = {|
	type: string,
	label?: string,
	items: Array<VariableItem>,
|};

/**
 * Merged, de-duplicated catalog rows for one variable type (main store + supplemental).
 */
export function collectCatalogItemsForVariableType(
	type: string,
	data: VariableCategoryDetail | DynamicVariableGroup,
	supplementalSections: Array<SupplementalCustomSection>
): Array<VariableItem> {
	const mainItems = Array.isArray(data.items)
		? [...data.items]
		: Object.values(data.items || {});
	const extraItems = supplementalSections
		.filter((s) => s.type === type)
		.flatMap((s) => s.items);
	const seenIds: Set<string> = new Set();
	const catalogItems: Array<VariableItem> = [];

	for (const raw of [...mainItems, ...extraItems]) {
		// Catalog rows may be VariableItem-shaped objects from merged groups.
		const item = ((raw: any): ?VariableItem);
		if (!item || item.id === null || item.id === '') {
			continue;
		}
		const idKey = String(item.id);
		if (seenIds.has(idKey)) {
			continue;
		}
		seenIds.add(idKey);
		catalogItems.push(item);
	}

	return catalogItems;
}

/**
 * Custom global-style presets not already listed in the merged catalog (per type),
 * only for types that do not use a registered preset panel.
 */
export function getSupplementalCustomVariableSections(
	controlProps: ValueAddonControlProps
): Array<SupplementalCustomSection> {
	const sections: Array<SupplementalCustomSection> = [];

	for (const type of controlProps.variableTypes) {
		if (
			applyFilters(
				VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
				null,
				type
			)
		) {
			continue;
		}

		const cat = getVariableCategory(type);

		if (cat.notFound) {
			continue;
		}

		const mainItems = !Array.isArray(cat.items)
			? Object.values(cat.items || {})
			: cat.items || [];

		const mainIds = new Set(mainItems.map((i) => i.id).filter(Boolean));

		const customItems = getCustomGlobalStylePresetVariables(type).filter(
			(i) =>
				i.id &&
				!mainIds.has(i.id) &&
				i.value !== undefined &&
				i.value !== ''
		);

		if (!customItems.length) {
			continue;
		}

		sections.push({
			type,
			label: cat.label || type,
			items: customItems,
		});
	}

	return sections;
}

/**
 * Normalizes the variable picker search string for case-insensitive matching.
 */
export function normalizeVariablePickerSearchQuery(query: mixed): string {
	if (query === null || query === undefined) {
		return '';
	}
	return String(query).trim().toLowerCase();
}

const VARIABLE_PICKER_SEARCH_KEYS = ['name', 'slug', 'title', 'label', 'id'];

/**
 * Whether a catalog row or repeater preset row matches the normalized search query.
 */
export function variablePickerItemMatchesSearch(
	item: Object,
	normalizedQuery: string
): boolean {
	if (!normalizedQuery) {
		return true;
	}
	if (!item || typeof item !== 'object') {
		return false;
	}
	for (const key of VARIABLE_PICKER_SEARCH_KEYS) {
		if (!(key in item)) {
			continue;
		}
		// $FlowFixMe[prop-missing] dynamic key on catalog / repeater row objects
		const value = item[key];
		if (value === null || value === undefined) {
			continue;
		}
		if (typeof value === 'string' || typeof value === 'number') {
			if (String(value).toLowerCase().includes(normalizedQuery)) {
				return true;
			}
		}
	}
	return false;
}

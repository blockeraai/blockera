// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
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
 * Modifier for variable preset popovers (e.g. `blockera-control-popover-variables-type-color`).
 */
export function variablePickerPopoverTypeClassName(presetType: string): string {
	const segment = String(presetType).trim().toLowerCase();
	if (segment === '') {
		return '';
	}
	return controlInnerClassNames(`popover-variables-type-${segment}`);
}

/**
 * Purpose of the variable popover: catalog picker vs add/edit form.
 * e.g. `blockera-control-popover-variables-mode-picker`
 */
export function variablePopoverModeClassName(mode: 'picker' | 'edit'): string {
	return controlInnerClassNames(`popover-variables-mode-${mode}`);
}

/**
 * Built-in picker keys from the control plus bootstrapped groups whose `type`
 * matches (e.g. Blocksy `blocksy-colors` when the control offers `color`).
 */
export function buildVariablePickerSectionKeys(
	controlVariableTypes: Array<string>,
	variableGroups: ?Object
): Array<string> {
	const groups =
		variableGroups && typeof variableGroups === 'object'
			? variableGroups
			: {};
	const dynamicKeys: Array<string> = [];

	for (const groupKey of Object.keys(groups)) {
		const group = groups[groupKey];
		if (group?.type && controlVariableTypes.includes(group.type)) {
			dynamicKeys.push(groupKey);
		}
	}

	const seen = new Set<string>();
	const keys: Array<string> = [];

	for (const key of [...dynamicKeys, ...controlVariableTypes]) {
		if (seen.has(key)) {
			continue;
		}
		seen.add(key);
		keys.push(key);
	}

	return keys;
}

/**
 * True when `sectionKey` is a bootstrapped variable group, not a built-in category.
 */
export function isVariablePickerDynamicGroupSection(
	sectionKey: string,
	controlVariableTypes: Array<string>
): boolean {
	if (!getVariableCategory(sectionKey).notFound) {
		return false;
	}

	return resolveVariablePickerRow(sectionKey, controlVariableTypes) !== null;
}

/**
 * Resolve store / category data for one variable type in the picker list.
 */
export function resolveVariablePickerRow(
	type: string,
	controlVariableTypes: Array<string>
): ResolvedVariablePickerRow | null {
	let data: DynamicVariableGroup | VariableCategoryDetail =
		getVariableCategory(type);

	if (data.notFound) {
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

const VARIABLE_PICKER_SEARCH_KEYS = [
	'name',
	'slug',
	'title',
	'label',
	'id',
	'color',
];

/**
 * Split a normalized picker search string into whitespace-separated tokens.
 */
export function tokenizeVariablePickerSearchQuery(
	normalizedQuery: string
): Array<string> {
	if (!normalizedQuery) {
		return [];
	}
	return normalizedQuery.split(/\s+/).filter(Boolean);
}

/**
 * Append a scalar field value to the searchable haystack buffer.
 */
function appendVariablePickerSearchHaystackPart(
	parts: Array<string>,
	raw: mixed
): void {
	if (raw === null || raw === undefined || raw === '') {
		return;
	}
	if (typeof raw === 'string' || typeof raw === 'number') {
		parts.push(String(raw).toLowerCase());
		return;
	}
	if (typeof raw === 'object') {
		try {
			parts.push(JSON.stringify(raw).toLowerCase());
		} catch (_error) {
			// Skip non-serializable values in search haystack.
		}
	}
}

/**
 * Build one lowercase haystack string from searchable catalog / picker row fields.
 */
export function buildVariablePickerSearchHaystack(item: Object): string {
	if (!item || typeof item !== 'object') {
		return '';
	}

	const parts: Array<string> = [];

	for (const key of VARIABLE_PICKER_SEARCH_KEYS) {
		if (!(key in item)) {
			continue;
		}
		// $FlowFixMe[prop-missing] dynamic key on catalog / repeater row objects
		appendVariablePickerSearchHaystackPart(parts, item[key]);
	}

	if ('value' in item) {
		// $FlowFixMe[prop-missing] preset rows may expose CSS tokens or structured payloads
		appendVariablePickerSearchHaystackPart(parts, item.value);
	}

	return parts.join(' ');
}

/**
 * Whether a catalog row or repeater preset row matches the normalized search query.
 * Multi-word queries use AND semantics: every token must match somewhere in the haystack.
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

	const tokens = tokenizeVariablePickerSearchQuery(normalizedQuery);
	if (!tokens.length) {
		return true;
	}

	const haystack = buildVariablePickerSearchHaystack(item);
	if (!haystack) {
		return false;
	}

	for (let i = 0, n = tokens.length; i < n; i++) {
		if (haystack.indexOf(tokens[i]) === -1) {
			return false;
		}
	}

	return true;
}

/**
 * Whether any catalog row across all variable types matches the normalized search query.
 */
export function variablePickerHasAnySearchMatches(
	sectionKeys: Array<string>,
	controlVariableTypes: Array<string>,
	supplementalSections: Array<SupplementalCustomSection>,
	normalizedSearch: string
): boolean {
	if (!normalizedSearch) {
		return true;
	}

	for (let i = 0, n = sectionKeys.length; i < n; i++) {
		const sectionKey = sectionKeys[i];
		const resolved = resolveVariablePickerRow(
			sectionKey,
			controlVariableTypes
		);

		if (!resolved) {
			continue;
		}

		const { data, effectiveType } = resolved;
		const catalogItems = collectCatalogItemsForVariableType(
			effectiveType,
			data,
			supplementalSections
		);

		for (let j = 0, m = catalogItems.length; j < m; j++) {
			if (
				variablePickerItemMatchesSearch(
					catalogItems[j],
					normalizedSearch
				)
			) {
				return true;
			}
		}
	}

	return false;
}

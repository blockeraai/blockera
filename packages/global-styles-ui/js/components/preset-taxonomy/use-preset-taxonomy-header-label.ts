/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	normalizeVariablePickerSearchQuery,
	usePresetVariablesViewMode,
	useVarPickerPresetContext,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { usePresetVariationsStorageOptional } from '../../context/preset-variations-context';
import {
	resolvePresetTaxonomyDisplayName,
	resolvePresetTaxonomyEditName,
} from './taxonomy-meta';

/**
 * Variable picker list/search modes show the full `/`-delimited preset name, not the taxonomy leaf.
 */
export function shouldUsePresetTaxonomyFullPickerLabel(
	pickerActive: boolean,
	variableType: string | null | undefined,
	searchQuery: string | undefined,
	viewMode: 'grouped' | 'list'
): boolean {
	if (pickerActive !== true || typeof variableType !== 'string') {
		return false;
	}
	if (normalizeVariablePickerSearchQuery(searchQuery) !== '') {
		return true;
	}
	return viewMode === 'list';
}

/**
 * Resolves the row header label for taxonomy vs flat repeater contexts.
 */
export function usePresetTaxonomyHeaderLabel(
	item: Record<string, unknown> | { name?: string },
	contextType: 'repeater' | 'taxonomy' = 'repeater'
): string {
	const storage = usePresetVariationsStorageOptional();
	const taxonomyNameSource = storage?.taxonomyNameSource;
	const pickerCtx = useVarPickerPresetContext();
	const { viewMode } = usePresetVariablesViewMode();

	return useMemo(() => {
		if (
			shouldUsePresetTaxonomyFullPickerLabel(
				pickerCtx.active === true,
				pickerCtx.variableType,
				pickerCtx.searchQuery,
				viewMode
			)
		) {
			return resolvePresetTaxonomyEditName(
				item as Record<string, unknown>,
				taxonomyNameSource
			);
		}

		if (contextType === 'taxonomy') {
			return resolvePresetTaxonomyDisplayName(
				item as Record<string, unknown>,
				taxonomyNameSource
			);
		}
		return String(item?.name ?? '');
	}, [
		item,
		contextType,
		taxonomyNameSource,
		pickerCtx.active,
		pickerCtx.variableType,
		pickerCtx.searchQuery,
		viewMode,
	]);
}

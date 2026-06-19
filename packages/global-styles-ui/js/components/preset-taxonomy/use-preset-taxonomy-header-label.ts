/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	normalizeVariablePickerSearchQuery,
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
 * Resolves the row header label for taxonomy vs flat repeater contexts.
 */
export function usePresetTaxonomyHeaderLabel(
	item: Record<string, unknown> | { name?: string },
	contextType: 'repeater' | 'taxonomy' = 'repeater'
): string {
	const storage = usePresetVariationsStorageOptional();
	const taxonomyNameSource = storage?.taxonomyNameSource;
	const pickerCtx = useVarPickerPresetContext();

	return useMemo(() => {
		const isPickerSearchActive =
			pickerCtx.active === true &&
			typeof pickerCtx.variableType === 'string' &&
			normalizeVariablePickerSearchQuery(pickerCtx.searchQuery) !== '';

		if (isPickerSearchActive) {
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
	]);
}

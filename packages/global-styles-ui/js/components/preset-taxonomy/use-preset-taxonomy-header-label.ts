/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { usePresetVariationsStorageOptional } from '../../context/preset-variations-context';
import { resolvePresetTaxonomyDisplayName } from './taxonomy-meta';

/**
 * Resolves the row header label for taxonomy vs flat repeater contexts.
 */
export function usePresetTaxonomyHeaderLabel(
	item: Record<string, unknown> | { name?: string },
	contextType: 'repeater' | 'taxonomy' = 'repeater'
): string {
	const storage = usePresetVariationsStorageOptional();
	const taxonomyNameSource = storage?.taxonomyNameSource;

	return useMemo(() => {
		if (contextType === 'taxonomy') {
			return resolvePresetTaxonomyDisplayName(
				item as Record<string, unknown>,
				taxonomyNameSource
			);
		}
		return String(item?.name ?? '');
	}, [item, contextType, taxonomyNameSource]);
}

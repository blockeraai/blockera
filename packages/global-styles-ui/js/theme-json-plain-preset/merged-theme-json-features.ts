/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { wrapExperimentalFeaturesRaw } from '@blockera/data';

/**
 * Live merged theme.json preset roots from the block editor (`__experimentalFeatures`),
 * in the same wrapped shape used by variable resolution helpers.
 */
export function useMergedThemeJsonExperimentalFeaturesWrapped():
	Record<string, unknown> | undefined {
	return useSelect((wpSelect) => {
		try {
			const editorSettings =
				wpSelect('core/block-editor')?.getSettings?.();
			return wrapExperimentalFeaturesRaw(
				editorSettings?.__experimentalFeatures
			) as Record<string, unknown> | undefined;
		} catch {
			return undefined;
		}
	}, []);
}

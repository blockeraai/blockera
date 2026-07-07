/**
 * Blockera dependencies
 */
import { experimental } from '@blockera/env';

const EXPERIMENTAL_PRESET_TAXONOMY_GROUPED_UI =
	'globalStylesUi.presetTaxonomyGroupedUi';

/**
 * When false in experimental.config.json under `globalStylesUi.presetTaxonomyGroupedUi`,
 * theme colors use the flat preset repeater instead of grouped taxonomy **only while the
 * variable picker is active**. Outside the picker (Site Editor palette), grouping follows
 * theme declarations only and this flag is not read.
 *
 * Default is enabled when the key is omitted (backwards compatible).
 */
export function isPresetTaxonomyGroupedUiEnabled(): boolean {
	return (
		experimental().get(EXPERIMENTAL_PRESET_TAXONOMY_GROUPED_UI) !== false
	);
}

/**
 * Internal dependencies
 */
import type { PresetFieldsPropsResolver } from './preset-group';

/**
 * Standard resolver passed to the preset repeater (`PresetGroup`): forwards `origin`,
 * `presetId`, and the repeater item under a stable key.
 * Call once at module scope and reuse so the function reference stays stable across renders.
 */
export function createPresetFieldsPropsResolver(
	itemKey: string
): PresetFieldsPropsResolver {
	return (item, itemId, origin) => ({
		origin,
		[itemKey]: item,
		presetId: itemId,
	});
}

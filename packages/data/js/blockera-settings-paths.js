// @flow
/**
 * Blockera-only theme.json settings paths (not in WordPress core schema).
 *
 * Stored under `settings.blockera.*` with `blockera` prefixed property names so
 * they do not collide with core keys (e.g. `border` radius vs border line presets).
 *
 * Keep in sync with {@see Blockera\Setup\Compatibility\BlockeraSettingsPaths} (PHP).
 */

/** Top-level settings namespace for Blockera extensions. */
export const BLOCKERA_SETTINGS_ROOT: string = 'blockera';

/** Prefixed property names under `settings.blockera`. */
export const BLOCKERA_SETTINGS_PROPERTY = {
	BORDER: 'blockeraBorder',
	LINE_HEIGHTS: 'blockeraLineHeights',
	DEFAULT_LINE_HEIGHTS: 'blockeraDefaultLineHeights',
	WIDTH_SIZES: 'blockeraWidthSizes',
	TRANSITION: 'blockeraTransition',
	TRANSFORM: 'blockeraTransform',
	FILTER: 'blockeraFilter',
	TEXT_SHADOW: 'blockeraTextShadow',
	DIMENSION_SIZES: 'blockeraDimensionSizes',
};

/** `useGlobalSetting` paths (relative to the settings root). */
export const BLOCKERA_GLOBAL_SETTING_PATH = {
	BORDER_PRESETS_THEME: 'blockera.blockeraBorder.presets.theme',
	BORDER_PRESETS_DEFAULT: 'blockera.blockeraBorder.presets.default',
	BORDER_PRESETS_CUSTOM: 'blockera.blockeraBorder.presets.custom',
	LINE_HEIGHTS_THEME: 'blockera.blockeraLineHeights.theme',
	LINE_HEIGHTS_DEFAULT: 'blockera.blockeraLineHeights.default',
	LINE_HEIGHTS_CUSTOM: 'blockera.blockeraLineHeights.custom',
	DEFAULT_LINE_HEIGHTS: 'blockera.blockeraDefaultLineHeights',
	WIDTH_SIZES_CUSTOM: 'blockera.blockeraWidthSizes.custom',
	TRANSITION_PRESETS_THEME: 'blockera.blockeraTransition.presets.theme',
	TRANSITION_PRESETS_DEFAULT: 'blockera.blockeraTransition.presets.default',
	TRANSITION_PRESETS_CUSTOM: 'blockera.blockeraTransition.presets.custom',
	TRANSITION_DEFAULT_PRESETS: 'blockera.blockeraTransition.defaultPresets',
	TRANSFORM_PRESETS_THEME: 'blockera.blockeraTransform.presets.theme',
	TRANSFORM_PRESETS_DEFAULT: 'blockera.blockeraTransform.presets.default',
	TRANSFORM_PRESETS_CUSTOM: 'blockera.blockeraTransform.presets.custom',
	TRANSFORM_DEFAULT_PRESETS: 'blockera.blockeraTransform.defaultPresets',
	FILTER_PRESETS_THEME: 'blockera.blockeraFilter.presets.theme',
	FILTER_PRESETS_DEFAULT: 'blockera.blockeraFilter.presets.default',
	FILTER_PRESETS_CUSTOM: 'blockera.blockeraFilter.presets.custom',
	FILTER_DEFAULT_PRESETS: 'blockera.blockeraFilter.defaultPresets',
	TEXT_SHADOW_PRESETS_THEME: 'blockera.blockeraTextShadow.presets.theme',
	TEXT_SHADOW_PRESETS_DEFAULT: 'blockera.blockeraTextShadow.presets.default',
	TEXT_SHADOW_PRESETS_CUSTOM: 'blockera.blockeraTextShadow.presets.custom',
	TEXT_SHADOW_DEFAULT_PRESETS: 'blockera.blockeraTextShadow.defaultPresets',
};

/** Custom-preset recreate paths (`settings.` prefix included). */
export const BLOCKERA_CUSTOM_PRESET_SETTINGS_PATH = {
	'line-height': 'settings.blockera.blockeraLineHeights.custom',
	'width-size': 'settings.blockera.blockeraWidthSizes.custom',
	border: 'settings.blockera.blockeraBorder.presets.custom',
	'text-shadow': 'settings.blockera.blockeraTextShadow.presets.custom',
	transform: 'settings.blockera.blockeraTransform.presets.custom',
	transition: 'settings.blockera.blockeraTransition.presets.custom',
	filter: 'settings.blockera.blockeraFilter.presets.custom',
};

type JsonObject = { +[string]: mixed };

function isPlainObject(value: mixed): boolean %checks {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Returns `__experimentalFeatures.blockera` when present. */
export function getBlockeraExperimentalFeatures(
	features: JsonObject | void
): JsonObject {
	if (!isPlainObject(features) || !isPlainObject(features.blockera)) {
		return {};
	}

	return features.blockera;
}

/** Preset metadata paths for Blockera-only buckets (theme.json settings tree). */
export const BLOCKERA_PRESET_METADATA_PATHS = {
	LINE_HEIGHTS: ['blockera', 'blockeraLineHeights'],
	WIDTH_SIZES: ['blockera', 'blockeraWidthSizes'],
	BORDER_PRESETS: ['blockera', 'blockeraBorder', 'presets'],
	TRANSITION_PRESETS: ['blockera', 'blockeraTransition', 'presets'],
	TRANSFORM_PRESETS: ['blockera', 'blockeraTransform', 'presets'],
	FILTER_PRESETS: ['blockera', 'blockeraFilter', 'presets'],
	TEXT_SHADOW_PRESETS: ['blockera', 'blockeraTextShadow', 'presets'],
	DIMENSION_SIZES: ['blockera', 'blockeraDimensionSizes'],
};

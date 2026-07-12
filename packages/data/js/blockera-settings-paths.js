// @flow
/**
 * Blockera-only theme.json settings paths (not in WordPress core schema).
 *
 * Flat `settings.blockera*` keys stay at the settings root. Line heights and
 * border-line presets nest under core nodes (`typography`, `border`) with a
 * `blockera*` property name so they do not collide with core keys.
 *
 * Keep in sync with {@see Blockera\Setup\Compatibility\BlockeraSettingsPaths} (PHP).
 */

/** Prefixed property names at the `settings` root. */
export const BLOCKERA_SETTINGS_PROPERTY = {
	WIDTH_SIZES: 'blockeraWidthSizes',
	TRANSITION: 'blockeraTransition',
	TRANSFORM: 'blockeraTransform',
	FILTER: 'blockeraFilter',
	TEXT_SHADOW: 'blockeraTextShadow',
	DIMENSION_SIZES: 'blockeraDimensionSizes',
};

/** Prefixed property names nested under core settings nodes. */
export const BLOCKERA_NESTED_SETTINGS_PROPERTY = {
	LINE_HEIGHTS: 'blockeraLineHeights',
	DEFAULT_LINE_HEIGHTS: 'blockeraDefaultLineHeights',
	BORDER: 'blockeraBorder',
};

/** All Blockera-only settings keys at the `settings` root. */
export const BLOCKERA_SETTINGS_KEYS: string[] = Object.values(
	BLOCKERA_SETTINGS_PROPERTY
);

/** `useGlobalSetting` paths (relative to the settings root). */
export const BLOCKERA_GLOBAL_SETTING_PATH = {
	BORDER_PRESETS_THEME: 'border.blockeraBorder.presets.theme',
	BORDER_PRESETS_DEFAULT: 'border.blockeraBorder.presets.default',
	BORDER_PRESETS_CUSTOM: 'border.blockeraBorder.presets.custom',
	LINE_HEIGHTS_THEME: 'typography.blockeraLineHeights.theme',
	LINE_HEIGHTS_DEFAULT: 'typography.blockeraLineHeights.default',
	LINE_HEIGHTS_CUSTOM: 'typography.blockeraLineHeights.custom',
	DEFAULT_LINE_HEIGHTS: 'typography.blockeraDefaultLineHeights',
	WIDTH_SIZES_CUSTOM: 'blockeraWidthSizes.custom',
	TRANSITION_PRESETS_THEME: 'blockeraTransition.presets.theme',
	TRANSITION_PRESETS_DEFAULT: 'blockeraTransition.presets.default',
	TRANSITION_PRESETS_CUSTOM: 'blockeraTransition.presets.custom',
	TRANSITION_DEFAULT_PRESETS: 'blockeraTransition.defaultPresets',
	TRANSFORM_PRESETS_THEME: 'blockeraTransform.presets.theme',
	TRANSFORM_PRESETS_DEFAULT: 'blockeraTransform.presets.default',
	TRANSFORM_PRESETS_CUSTOM: 'blockeraTransform.presets.custom',
	TRANSFORM_DEFAULT_PRESETS: 'blockeraTransform.defaultPresets',
	FILTER_PRESETS_THEME: 'blockeraFilter.presets.theme',
	FILTER_PRESETS_DEFAULT: 'blockeraFilter.presets.default',
	FILTER_PRESETS_CUSTOM: 'blockeraFilter.presets.custom',
	FILTER_DEFAULT_PRESETS: 'blockeraFilter.defaultPresets',
	TEXT_SHADOW_PRESETS_THEME: 'blockeraTextShadow.presets.theme',
	TEXT_SHADOW_PRESETS_DEFAULT: 'blockeraTextShadow.presets.default',
	TEXT_SHADOW_PRESETS_CUSTOM: 'blockeraTextShadow.presets.custom',
	TEXT_SHADOW_DEFAULT_PRESETS: 'blockeraTextShadow.defaultPresets',
};

/** Custom-preset recreate paths (`settings.` prefix included). */
export const BLOCKERA_CUSTOM_PRESET_SETTINGS_PATH = {
	'line-height': 'settings.typography.blockeraLineHeights.custom',
	'width-size': 'settings.blockeraWidthSizes.custom',
	border: 'settings.border.blockeraBorder.presets.custom',
	'text-shadow': 'settings.blockeraTextShadow.presets.custom',
	transform: 'settings.blockeraTransform.presets.custom',
	transition: 'settings.blockeraTransition.presets.custom',
	filter: 'settings.blockeraFilter.presets.custom',
};

type JsonObject = { +[string]: mixed };

function isPlainObject(value: mixed): boolean %checks {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Collects flat `blockera*` preset groups from `__experimentalFeatures`. */
export function getBlockeraExperimentalFeatures(
	features: JsonObject | void
): JsonObject {
	if (!isPlainObject(features)) {
		return {};
	}

	const result: JsonObject = {};

	for (const key of BLOCKERA_SETTINGS_KEYS) {
		if (key in features) {
			result[key] = features[key];
		}
	}

	return result;
}

/** Preset metadata paths for Blockera-only buckets (theme.json settings tree). */
export const BLOCKERA_PRESET_METADATA_PATHS = {
	LINE_HEIGHTS: ['typography', 'blockeraLineHeights'],
	WIDTH_SIZES: ['blockeraWidthSizes'],
	BORDER_PRESETS: ['border', 'blockeraBorder', 'presets'],
	TRANSITION_PRESETS: ['blockeraTransition', 'presets'],
	TRANSFORM_PRESETS: ['blockeraTransform', 'presets'],
	FILTER_PRESETS: ['blockeraFilter', 'presets'],
	TEXT_SHADOW_PRESETS: ['blockeraTextShadow', 'presets'],
	DIMENSION_SIZES: ['blockeraDimensionSizes'],
};

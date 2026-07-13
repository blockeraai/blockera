/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import {
	BorderRadiusPresetContent,
	BordersPresetContent,
	ColorPalettePresetContent,
	FallbackPresetContent,
	FiltersPresetContent,
	FontSizesPresetContent,
	LineHeightsPresetContent,
	LinearGradientsPresetContent,
	RadialGradientsPresetContent,
	ShadowsPresetContent,
	SpacingPresetContent,
	TextShadowsPresetContent,
	TransformsPresetContent,
	TransitionsPresetContent,
	WidthSizePresetContent,
} from '@blockera/global-styles-ui';
import {
	VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
	VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
} from '@blockera/controls';

const PRESET_PANEL_BY_TYPE = {
	spacing: SpacingPresetContent,
	'width-size': WidthSizePresetContent,
	'font-size': FontSizesPresetContent,
	'line-height': LineHeightsPresetContent,
	color: ColorPalettePresetContent,
	'linear-gradient': LinearGradientsPresetContent,
	'radial-gradient': RadialGradientsPresetContent,
	border: BordersPresetContent,
	'border-radius': BorderRadiusPresetContent,
	filter: FiltersPresetContent,
	shadow: ShadowsPresetContent,
	'text-shadow': TextShadowsPresetContent,
	transform: TransformsPresetContent,
	transition: TransitionsPresetContent,
};

/**
 * Wires `@blockera/global-styles-ui` into the block variable picker via `addFilter`, so
 * `@blockera/controls` never imports global-styles-ui (script order / externals).
 *
 * Registers the global-styles preset panel hook and the fallback catalog panel hook.
 */
addFilter(
	VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
	'blockera/editor-global-styles-preset-panels',
	(Panel, variableType) => PRESET_PANEL_BY_TYPE[variableType] || Panel
);

addFilter(
	VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
	'blockera/editor-global-styles-fallback-preset-panel',
	(Panel) => Panel || FallbackPresetContent
);

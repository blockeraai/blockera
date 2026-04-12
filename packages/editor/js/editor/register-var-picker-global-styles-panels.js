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
	FiltersPresetContent,
	FontSizesPresetContent,
	LinearGradientsPresetContent,
	RadialGradientsPresetContent,
	ShadowsPresetContent,
	SpacingPresetContent,
	TextShadowsPresetContent,
	TransformsPresetContent,
	TransitionsPresetContent,
} from '@blockera/global-styles-ui';
import { VAR_PICKER_PRESET_PANEL_FILTER } from '@blockera/controls';

const PRESET_PANEL_BY_TYPE = {
	spacing: SpacingPresetContent,
	'font-size': FontSizesPresetContent,
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
 * Wires `@blockera/global-styles-ui` preset editors into the block/variable picker
 * in `@blockera/controls`. Implemented with `addFilter` so controls does not import
 * global-styles-ui (that would conflict with webpack externals and script order:
 * controls loads before global-styles-ui, while global-styles-ui depends on controls).
 */
addFilter(
	VAR_PICKER_PRESET_PANEL_FILTER,
	'blockera/editor-global-styles-preset-panels',
	(Panel, variableType) => PRESET_PANEL_BY_TYPE[variableType] || Panel
);

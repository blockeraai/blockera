export {
	registerGlobalStylesPresetPreviewHelpers,
	registerPresetPreviewCssHelpers,
	type GlobalStylesPresetPreviewHelpers,
	type PresetPreviewCssHelpers,
	type SpacingSizePresetUsage,
	type ColorPresetPreviewUsage,
} from './preset-preview/injected-helpers';
export {
	useMergedThemeJsonExperimentalFeaturesWrapped,
	usePlainThemeJsonPresetMergedState,
	getPlainThemeJsonPresetMergedState,
	resolveThemeJsonPresetScalarForGlobalStylesUi,
	splitStoredCompositePlainPresetValue,
	plainPresetSlugFromStoredPlainPresetInput,
	compositeResolvedValueFromStoredPlainPresetInput,
	unlinkPlainThemeJsonPresetCompositeToScalar,
	isLikelyThemeJsonPlainPresetSlugString,
	type PlainThemeJsonPresetMergedStateArgs,
	type UsePlainThemeJsonPresetMergedStateArgs,
	type ResolveThemeJsonPresetScalarForGlobalStylesUiArgs,
} from './theme-json-plain-preset';
export {
	mergeBaseAndUserConfigs,
	useGlobalStylesContext,
} from './context/global-styles-provider';
export {
	PresetVariationsContext,
	usePresetVariationsStorage,
	type PresetVariationsContextValue,
} from './context/preset-variations-context';
export { getVariationClassName } from './theme-json-utils';
export { useGlobalSetting, useGlobalStyle } from './context/global-style-hooks';

export { Borders } from './borders';
export { Filters } from './filters';
export { Spacing, SpacingPresetPreviewUsageProvider } from './spacing';
export { Transforms } from './transforms';
export { Transitions } from './transitions';
export { TextShadows } from './text-shadows';
export { BorderRadius } from './border-radius';

/** Preset editor bodies (theme / default / custom), for reuse outside full navigation shells. */
export { SpacingPresetContent } from './spacing';
export { FontSizesPresetContent } from './font-sizes';
export { BordersPresetContent } from './borders';
export { BorderRadiusPresetContent } from './border-radius';
export { FiltersPresetContent } from './filters';
export { ShadowsPresetContent } from './shadows';
export { TextShadowsPresetContent } from './text-shadows';
export { TransformsPresetContent } from './transforms';
export { TransitionsPresetContent } from './transitions';
export {
	ColorPalettePresetContent,
	ColorPresetPreviewUsageProvider,
} from './colors/color-palette-screen';
export { LinearGradientsPresetContent } from './colors/linear-gradients-screen';
export { RadialGradientsPresetContent } from './colors/radial-gradients-screen';
export { FallbackPresetContent } from './components/fallback-preset-content';

export { colorsPanelHandler } from './colors/colors-panel-handler';
export { typographyPanelHandler } from './font-sizes/typography-panel-handler';
export { shadowsPanelHandler } from './shadows/shadows-panel-handler';

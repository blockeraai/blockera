/**
 * Panel override module (side-effect: loads WP 7-compatible override styles).
 */
import './panel-override';

export {
	registerGlobalStylesPresetPreviewHelpers,
	registerPresetPreviewCssHelpers,
	type GlobalStylesPresetPreviewHelpers,
	type PresetPreviewCssHelpers,
} from './preset-preview/injected-helpers';
export type { SpacingSizePresetUsage } from './spacing/spacing-preset-preview-usage';
export type { ColorPresetPreviewUsage } from './colors/color-preset-preview-usage';
export type { FilterPresetPreviewUsage } from './filters/filter-preset-preview-usage';
export type { BorderPresetPreviewUsage } from './borders/border-preset-preview-usage';
export type { BorderRadiusPresetPreviewUsage } from './border-radius/border-radius-preset-preview-usage';
export type { GradientPresetPreviewUsage } from './colors/gradient-preset-preview-usage';
export {
	useMergedThemeJsonExperimentalFeaturesWrapped,
	usePlainThemeJsonPresetMergedState,
	getPlainThemeJsonPresetMergedState,
	resolveThemeJsonPresetScalarForGlobalStylesUi,
	splitStoredCompositePlainPresetValue,
	normalizeCompositePlainPresetPaintPart,
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

export {
	getGlobalStylesPanelSelectors,
	getGlobalStylesPanelTargets,
	queryGlobalStylesPanelElement,
	queryActiveGlobalStylesNavigatorScreen,
	queryStyleBookIframe,
	getDualGlobalStylesSelector,
	getStyleBookBlockExampleSelector,
	getWordPressVersion,
	isWordPress70OrHigher,
	createGlobalStylesPanelHandler,
	useOverrideNavigator,
	findGlobalStylesNavigatorBackButton,
	findGlobalStylesScreenHeader,
	setGlobalStylesScreenHeaderTitle,
	revealGlobalStylesScreenHeader,
	attachGlobalStylesNavigatorBackListener,
	NAVIGATOR_BACK_RETRY_INTERVAL_MS,
	NAVIGATOR_BACK_MAX_RETRY_ATTEMPTS,
	removeBlockeraGlobalStylesUiBodyClass,
	BLOCKERA_GLOBAL_STYLES_UI_BODY_CLASS,
	BLOCKERA_NAVIGATION_OVERRIDE_CLASS,
	BLOCKERA_NAVIGATION_PANEL_CLASS,
	type GlobalStylesPanelSelectors,
	type GlobalStylesPanelTargets,
	type PresetPanelOverride,
	navigateToGlobalStylesPath,
} from './panel-override';

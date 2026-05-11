/**
 * Shared helpers for global-styles preset UIs: merged theme.json store subscription,
 * orphan/missing plain preset detection, composite `{resolvedCss},{slug}` handling,
 * display resolution across preset buckets, and unlink semantics for composites.
 */

export {
	splitStoredCompositePlainPresetValue,
	normalizeCompositePlainPresetPaintPart,
	plainPresetSlugFromStoredPlainPresetInput,
	compositeResolvedValueFromStoredPlainPresetInput,
	unlinkPlainThemeJsonPresetCompositeToScalar,
	isLikelyThemeJsonPlainPresetSlugString,
} from './composite-plain-preset';

export { useMergedThemeJsonExperimentalFeaturesWrapped } from './merged-theme-json-features';

export {
	getPlainThemeJsonPresetMergedState,
	usePlainThemeJsonPresetMergedState,
	type PlainThemeJsonPresetMergedStateArgs,
	type UsePlainThemeJsonPresetMergedStateArgs,
} from './plain-preset-merged-state';

export {
	resolveThemeJsonPresetScalarForGlobalStylesUi,
	type ResolveThemeJsonPresetScalarForGlobalStylesUiArgs,
} from './resolve-preset-display-scalar';

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isThemeJsonVariableDefinedInMergedFeatures } from '@blockera/data';

/**
 * Internal dependencies
 */
import {
	compositeResolvedValueFromStoredPlainPresetInput,
	hasExplicitPlainThemeJsonPresetStorage,
	isLikelyThemeJsonPlainPresetSlugString,
	plainPresetSlugFromStoredPlainPresetInput,
} from './composite-plain-preset';
import { useMergedThemeJsonExperimentalFeaturesWrapped } from './merged-theme-json-features';

export type PlainThemeJsonPresetMergedStateArgs = {
	mergedFeaturesWrapped: Record<string, unknown> | null | undefined;
	storedScalar: string;
	presetCssVarInfix: string | undefined;
	themeJsonResolutionBlockName?: string;
};

/**
 * Derived state for UI that treats plain preset slugs (and composite storage) against merged theme.json.
 */
export function getPlainThemeJsonPresetMergedState(
	args: PlainThemeJsonPresetMergedStateArgs
): {
	effectiveSlug: string;
	compositeResolvedPart: string;
	slugLooksLikeThemeJsonPreset: boolean;
	hasPresetResolutionContext: boolean;
	isDefinedInMergedThemeJson: boolean;
	isMissingFromMergedThemeJson: boolean;
} {
	const trimmed =
		typeof args.storedScalar === 'string' ? args.storedScalar.trim() : '';

	const effectiveSlug = plainPresetSlugFromStoredPlainPresetInput(trimmed);
	const compositeResolvedPart =
		compositeResolvedValueFromStoredPlainPresetInput(trimmed);

	const presetResolutionCssVarInfix =
		args.presetCssVarInfix !== undefined &&
		args.presetCssVarInfix !== null &&
		String(args.presetCssVarInfix) !== ''
			? args.presetCssVarInfix
			: undefined;

	const hasPresetResolutionContext =
		args.mergedFeaturesWrapped !== undefined &&
		args.mergedFeaturesWrapped !== null &&
		presetResolutionCssVarInfix !== undefined;

	const slugLooksLikeThemeJsonPreset =
		effectiveSlug !== '' &&
		isLikelyThemeJsonPlainPresetSlugString(effectiveSlug);

	const isDefinedInMergedThemeJson =
		effectiveSlug !== '' &&
		hasPresetResolutionContext &&
		isThemeJsonVariableDefinedInMergedFeatures(
			args.mergedFeaturesWrapped,
			effectiveSlug,
			args.themeJsonResolutionBlockName ?? '',
			presetResolutionCssVarInfix
		);

	const isMissingFromMergedThemeJson =
		Boolean(hasPresetResolutionContext) &&
		slugLooksLikeThemeJsonPreset &&
		!isDefinedInMergedThemeJson &&
		hasExplicitPlainThemeJsonPresetStorage(trimmed);

	return {
		effectiveSlug,
		compositeResolvedPart,
		slugLooksLikeThemeJsonPreset,
		hasPresetResolutionContext,
		isDefinedInMergedThemeJson,
		isMissingFromMergedThemeJson,
	};
}

export type UsePlainThemeJsonPresetMergedStateArgs = Omit<
	PlainThemeJsonPresetMergedStateArgs,
	'mergedFeaturesWrapped'
> & {
	mergedFeaturesWrapped?: Record<string, unknown> | null | undefined;
};

export function usePlainThemeJsonPresetMergedState(
	args: UsePlainThemeJsonPresetMergedStateArgs
): ReturnType<typeof getPlainThemeJsonPresetMergedState> {
	const mergedFromEditor = useMergedThemeJsonExperimentalFeaturesWrapped();
	const merged = args.mergedFeaturesWrapped ?? mergedFromEditor;

	const blockName = args.themeJsonResolutionBlockName ?? '';
	const infix = args.presetCssVarInfix;
	const storedScalar = args.storedScalar;

	return useMemo(
		() =>
			getPlainThemeJsonPresetMergedState({
				mergedFeaturesWrapped: merged,
				storedScalar,
				presetCssVarInfix: infix,
				themeJsonResolutionBlockName: blockName,
			}),
		[merged, storedScalar, infix, blockName]
	);
}

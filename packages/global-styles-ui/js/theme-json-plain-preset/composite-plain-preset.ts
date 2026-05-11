/**
 * Blockera dependencies
 *
 * Composite `{resolvedCss},{presetSlug}` storage is shared across theme.json preset buckets
 * (colors, gradients, shadows, etc.). Naming here avoids implying colors-only usage.
 */
export {
	splitStoredCompositePlainColorValue as splitStoredCompositePlainPresetValue,
	normalizeCompositePlainPresetPaintPart,
	plainPresetSlugFromStoredPlainPresetInput,
	compositePlainColorPaintFromStoredPlainPresetInput as compositeResolvedValueFromStoredPlainPresetInput,
	unlinkPlainThemeJsonPresetCompositeToScalar,
	isLikelyThemeJsonPlainPresetSlugString,
} from '@blockera/controls';

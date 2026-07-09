// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

export const getBlockEditorSettings = (): Object => {
	const { getSettings } = select('core/block-editor');

	return getSettings();
};

export {
	getLinearGradients,
	getLinearGradientBy,
	getLinearGradient,
} from './linear-gradient';
export {
	getRadialGradients,
	getRadialGradientBy,
	getRadialGradient,
} from './radial-gradient';
export {
	getLinearGradientVAFromIdString,
	getRadialGradientVAFromIdString,
	getGradientVAFromVarString,
	getGradientVAFromIdString,
	getGradientType,
} from './gradient';
export {
	getFontSizes,
	getFontSizeBy,
	getFontSize,
	getFontSizeVAStringFromId,
	getFontSizeVAFromIdString,
	getFontSizeVAFromVarString,
} from './font-size';
export {
	getLineHeights,
	getLineHeightBy,
	getLineHeight,
	getLineHeightVAStringFromId,
	getLineHeightVAFromIdString,
	getLineHeightVAFromVarString,
} from './line-height';
export {
	getSpacings,
	getSpacingBy,
	getSpacing,
	getSpacingVAFromIdString,
	getSpacingVAFromVarString,
} from './spacing';
export {
	getWidthSizes,
	getWidthSizeBy,
	getWidthSize,
	getWidthSizeVAFromIdString,
	getWidthSizeVAFromVarString,
} from './width-size';
export {
	getColors,
	getColorBy,
	getColor,
	getColorVAFromIdString,
	getColorVAFromVarString,
} from './color';
export {
	getBorderRadii,
	getBorderRadiusBy,
	getBorderRadius,
	getBorderRadiusVAFromIdString,
	getBorderRadiusVAFromVarString,
	getBorderRadiusVAStringFromId,
} from './border-radius';
export {
	getCustomGlobalStylePresetVariables,
	getMergedGlobalStylePresetVariables,
	getGlobalStylePresetVariableById,
} from './custom-global-style-presets';
export {
	referenceFromPresetOrigin,
	buildPresetVariablePickerPayload,
	serializeGlobalStylePresetItemValue,
} from './preset-variable-picker-payload';
export {
	normalizePresetSize,
	normalizeFontSizeFluid,
	normalizeFontSizeThemeJsonPreset,
	normalizeSizeThemeJsonPreset,
} from './normalize-preset-sizes';
export { tryParseLegacyJsonObject } from './legacy-json-settings';
export { getVariable } from './get-variable';
export {
	generateVariableString,
	generateAttributeVarStringFromVA,
	generateVariableStringFromAttributeVarString,
	matchesVarStringMiddleType,
	getValueAddonFromVarString,
	parseVarString,
} from './utils';
export type { GetValueAddonFromVarStringOptions } from './utils';

export {
	THEME_JSON_PRESET_METADATA_BASE,
	getValueFromObjectPath,
	findInPresetsBy,
	getValueFromVariable,
	wrapExperimentalFeaturesRaw,
	getWpMergedExperimentalFeaturesWrapped,
	parseThemeJsonVariableToken,
	isThemeJsonVariableResolutionCandidateString,
	isThemeJsonVariableDefinedInMergedFeatures,
	isThemeJsonVariableDefinedInWpEditor,
	inferPresetCssVarInfixForPaintVariablePickerType,
	normalizeThemeJsonPresetLeafForScalarUi,
	resolvePlainThemeJsonPresetSlugResolutionFromWpEditor,
	resolvePlainThemeJsonPresetSlugValueFromWpEditor,
	resolveThemeJsonPaintPresetStringFromWpEditor,
	resolveThemeJsonVariableStringFromWpEditor,
} from './theme-json-variable-resolution';
export type {
	ThemeJsonPresetResolutionRow,
	ParsedThemeJsonVariableToken,
	PlainThemeJsonPresetSlugResolution,
	ResolveThemeJsonPaintPresetStringFromWpEditorOptions,
} from './theme-json-variable-resolution';

export * from './types';
export * from './store/types';

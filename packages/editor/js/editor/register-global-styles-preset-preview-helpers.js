// @flow

/**
 * Wires `@blockera/editor` into global-styles / value-addon preset preview:
 * - CSS generators → `@blockera/global-styles-ui` (injected helpers; global-styles-ui may load before editor).
 * - Picker prop inference (`colorPresetPreviewUsage` / `spacingPresetPreviewUsage`) → `@blockera/controls` registry consumed by `useValueAddon`.
 */

/**
 * Blockera dependencies
 */
import { registerPresetPreviewCssHelpers } from '@blockera/global-styles-ui';
import { registerValueAddonPresetPreviewPickerMerge } from '@blockera/controls/js/value-addons/preset-preview-picker-props-registry';

/**
 * Internal dependencies
 */
import { mergePickerPropsWithPresetPreviewInference } from '../extensions/libs/preset-preview-inference';
import {
	getGlobalStylesBorderPresetPreviewCss,
	getGlobalStylesBorderRadiusPresetPreviewCss,
	getGlobalStylesColorPresetPreviewCss,
	getGlobalStylesFilterPresetPreviewCss,
	getGlobalStylesFontSizePresetPreviewCss,
	getGlobalStylesGradientPresetPreviewCss,
	getGlobalStylesShadowPresetPreviewCss,
	getGlobalStylesSpacingSizePresetPreviewCss,
	getGlobalStylesTextShadowCssPreviewCss,
	getGlobalStylesTransformPresetPreviewCss,
	getGlobalStylesTransitionPresetPreviewCss,
} from '../extensions/libs/preset-preview-css/global-styles-preset-preview-css';

registerValueAddonPresetPreviewPickerMerge(
	mergePickerPropsWithPresetPreviewInference
);

registerPresetPreviewCssHelpers({
	getGlobalStylesShadowPresetPreviewCss,
	getGlobalStylesTextShadowCssPreviewCss,
	getGlobalStylesTransitionPresetPreviewCss,
	getGlobalStylesFilterPresetPreviewCss,
	getGlobalStylesTransformPresetPreviewCss,
	getGlobalStylesBorderPresetPreviewCss,
	getGlobalStylesBorderRadiusPresetPreviewCss,
	getGlobalStylesSpacingSizePresetPreviewCss,
	getGlobalStylesFontSizePresetPreviewCss,
	getGlobalStylesColorPresetPreviewCss,
	getGlobalStylesGradientPresetPreviewCss,
});

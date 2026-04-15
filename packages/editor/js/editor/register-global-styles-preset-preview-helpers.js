// @flow

/**
 * Wires `@blockera/editor` preset-preview CSS generators into `@blockera/global-styles-ui`
 * (injected helpers). Global-styles-ui loads as an early asset without importing editor.
 */

/**
 * Blockera dependencies
 */
import { registerPresetPreviewCssHelpers } from '@blockera/global-styles-ui';

/**
 * Internal dependencies
 */
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

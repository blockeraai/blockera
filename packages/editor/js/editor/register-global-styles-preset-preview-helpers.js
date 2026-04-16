// @flow

/**
 * Wires `@blockera/editor` into global-styles / value-addon preset preview:
 * - Attribute patches → style engine (`StateStyle`) via PresetCanvasPreviewContext.
 * - Gradient / legacy declaration strings → canvas CSS inject.
 * - Picker prop inference (`colorPresetPreviewUsage` / `spacingPresetPreviewUsage`) → `@blockera/controls` registry consumed by `useValueAddon`.
 */

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { registerGlobalStylesPresetPreviewHelpers } from '@blockera/global-styles-ui';

/**
 * Internal dependencies
 */
import { mergePickerPropsWithPresetPreviewInference } from '../extensions/libs/preset-preview-inference';
import {
	getGlobalStylesBorderPresetPreviewAttributes,
	getGlobalStylesBorderRadiusPresetPreviewAttributes,
	getGlobalStylesColorPresetPreviewAttributes,
	getGlobalStylesFilterPresetPreviewAttributes,
	getGlobalStylesFontSizePresetPreviewAttributes,
	getGlobalStylesShadowPresetPreviewAttributes,
	getGlobalStylesSpacingSizePresetPreviewAttributes,
	getGlobalStylesTextShadowPreviewAttributes,
	getGlobalStylesTransformPresetPreviewAttributes,
	getGlobalStylesTransitionPresetPreviewAttributes,
} from '../extensions/libs/preset-preview-attributes/global-styles-preset-preview-attributes';

addFilter(
	'blockera.controls.var-picker.merge-picker-props-with-preset-preview',
	'blockera.editor.register-global-styles-preset-preview-helpers',
	() => mergePickerPropsWithPresetPreviewInference
);

registerGlobalStylesPresetPreviewHelpers({
	getGlobalStylesShadowPresetPreviewAttributes,
	getGlobalStylesTextShadowPreviewAttributes,
	getGlobalStylesTransitionPresetPreviewAttributes,
	getGlobalStylesFilterPresetPreviewAttributes,
	getGlobalStylesTransformPresetPreviewAttributes,
	getGlobalStylesBorderPresetPreviewAttributes,
	getGlobalStylesBorderRadiusPresetPreviewAttributes,
	getGlobalStylesSpacingSizePresetPreviewAttributes,
	getGlobalStylesFontSizePresetPreviewAttributes,
	getGlobalStylesColorPresetPreviewAttributes,
});

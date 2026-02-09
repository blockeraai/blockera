// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import type { ControlContextRefCurrent } from '@blockera/controls';
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	fontFamilyFromWPCompatibility,
	fontFamilyToWPCompatibility,
} from './compatibility/font-family';
import {
	fontSizeFromWPCompatibility,
	fontSizeToWPCompatibility,
} from './compatibility/font-size';
import {
	lineHeightFromWPCompatibility,
	lineHeightToWPCompatibility,
} from './compatibility/line-height';
import {
	textAlignFromWPCompatibility,
	textAlignToWPCompatibility,
} from './compatibility/text-align';
import {
	textDecorationFromWPCompatibility,
	textDecorationToWPCompatibility,
} from './compatibility/text-decoration';
import {
	fontAppearanceFromWPCompatibility,
	fontAppearanceToWPCompatibility,
} from './compatibility/font-appearance';
import {
	textTransformFromWPCompatibility,
	textTransformToWPCompatibility,
} from './compatibility/text-transform';
import {
	letterSpacingFromWPCompatibility,
	letterSpacingToWPCompatibility,
} from './compatibility/letter-spacing';
import {
	textOrientationFromWPCompatibility,
	textOrientationToWPCompatibility,
} from './compatibility/text-orientation';
import {
	fontColorFromWPCompatibility,
	fontColorToWPCompatibility,
} from './compatibility/font-color';
import type { BlockDetail } from '../block-card/block-states/types';
import { isBlockNotOriginalState, isInvalidCompatibilityRun } from '../utils';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.typographyExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, insideBlockInspector, editorSelectedBlockEvent } =
				blockDetail;

			if (isBlockNotOriginalState(blockDetail)) {
				return attributes;
			}

			const runSelectedBlockEvent = [
				'save-customizations',
				'detach-style',
			].includes(editorSelectedBlockEvent);

			//
			// Font Family
			//
			attributes = fontFamilyFromWPCompatibility({
				attributes,
				insideBlockInspector,
				runSelectedBlockEvent,
			});

			//
			// Font Size
			//
			attributes = fontSizeFromWPCompatibility({
				attributes,
				insideBlockInspector,
				runSelectedBlockEvent,
			});

			//
			// Line Height
			//
			attributes = lineHeightFromWPCompatibility({
				attributes,
				insideBlockInspector,
				runSelectedBlockEvent,
			});

			//
			// Text Align
			//
			attributes = textAlignFromWPCompatibility({
				attributes,
				blockId,
				insideBlockInspector,
				runSelectedBlockEvent,
			});

			//
			// Text Decoration
			//
			attributes = textDecorationFromWPCompatibility({
				attributes,
				insideBlockInspector,
				runSelectedBlockEvent,
			});

			//
			// Font Appearance
			//
			attributes = fontAppearanceFromWPCompatibility({
				attributes,
				insideBlockInspector,
				runSelectedBlockEvent,
			});

			//
			// Text Transform
			//
			attributes = textTransformFromWPCompatibility({
				attributes,
				insideBlockInspector,
				runSelectedBlockEvent,
			});

			//
			// Letter Spacing
			//
			attributes = letterSpacingFromWPCompatibility({
				attributes,
				insideBlockInspector,
				runSelectedBlockEvent,
			});

			//
			// Text Orientation
			//
			attributes = textOrientationFromWPCompatibility({
				attributes,
				insideBlockInspector,
				runSelectedBlockEvent,
			});

			//
			// Text Color
			//
			attributes = fontColorFromWPCompatibility({
				attributes,
				insideBlockInspector,
				runSelectedBlockEvent,
			});

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.typographyExtension.bootstrap.setAttributes',
		/**
		 * Retrieve block attributes with WordPress compatibilities.
		 *
		 * @callback getAttributes
		 *
		 * @param {Object} nextState The block attributes changed with blockera feature newValue and latest version of block state.
		 * @param {string} featureId The blockera feature identifier.
		 * @param {*} newValue The newValue sets to feature.
		 * @param {ControlContextRefCurrent} ref The reference of control context action occurred.
		 * @param {blockDetail} blockDetail detail of current block
		 *
		 * @return {Object|{}} The retrieve updated block attributes with all of wp compatibilities.
		 */
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRefCurrent,
			getAttributes: () => Object,
			blockDetail: BlockDetail
		): Object => {
			const { blockId, insideBlockInspector, editorSelectedBlockEvent } =
				blockDetail;

			if (isInvalidCompatibilityRun(blockDetail, ref)) {
				return nextState;
			}

			const runSelectedBlockEvent = [
				'save-customizations',
				'detach-style',
			].includes(editorSelectedBlockEvent);

			switch (featureId) {
				case 'blockeraFontFamily':
					return mergeObject(
						nextState,
						fontFamilyToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							runSelectedBlockEvent,
						})
					);

				case 'blockeraFontAppearance':
					return mergeObject(
						nextState,
						fontAppearanceToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							runSelectedBlockEvent,
						})
					);

				case 'blockeraFontSize':
					return mergeObject(
						nextState,
						fontSizeToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							runSelectedBlockEvent,
						})
					);

				case 'blockeraLineHeight':
					return mergeObject(
						nextState,
						lineHeightToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							runSelectedBlockEvent,
						})
					);

				case 'blockeraTextAlign':
					return mergeObject(
						nextState,
						textAlignToWPCompatibility({
							newValue,
							ref,
							blockId,
							insideBlockInspector,
							runSelectedBlockEvent,
						})
					);

				case 'blockeraTextDecoration':
					return mergeObject(
						nextState,
						textDecorationToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							runSelectedBlockEvent,
						})
					);

				case 'blockeraTextTransform':
					return mergeObject(
						nextState,
						textTransformToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							runSelectedBlockEvent,
						})
					);

				case 'blockeraLetterSpacing':
					return mergeObject(
						nextState,
						letterSpacingToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							runSelectedBlockEvent,
						})
					);

				case 'blockeraTextOrientation':
					return mergeObject(
						nextState,
						textOrientationToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							runSelectedBlockEvent,
						})
					);

				case 'blockeraFontColor':
					return mergeObject(
						nextState,
						fontColorToWPCompatibility({
							newValue,
							ref,
							getAttributes,
							blockDetail,
							insideBlockInspector,
							runSelectedBlockEvent,
						})
					);
			}

			return nextState;
		}
	);
};

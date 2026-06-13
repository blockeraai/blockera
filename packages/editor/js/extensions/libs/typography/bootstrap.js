// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import type { ControlContextRefCurrent } from '@blockera/controls';

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
	textIndentFromWPCompatibility,
	textIndentToWPCompatibility,
} from './compatibility/text-indent';
import {
	textOrientationFromWPCompatibility,
	textOrientationToWPCompatibility,
} from './compatibility/text-orientation';
import {
	fontColorFromWPCompatibility,
	fontColorToWPCompatibility,
} from './compatibility/font-color';
import type { BlockDetail } from '../block-card/block-states/types';
import {
	isInvalidCompatibilityRun,
	mergeWPCompatibility,
	sanitizeWPCompatibilityAttributes,
} from '../utils';
import {
	registerHideCoreTextAlignToolbarDom,
	registerHideCoreTextAlignToolbarSupports,
} from './hide-core-text-align-toolbar';

export const bootstrap = (): void => {
	registerHideCoreTextAlignToolbarSupports();
	registerHideCoreTextAlignToolbarDom();

	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.typographyExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, insideBlockInspector, editorSelectedBlockEvent } =
				blockDetail;

			//
			// Font Family
			//
			attributes = fontFamilyFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Font Size
			//
			attributes = fontSizeFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Line Height
			//
			attributes = lineHeightFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Text Align
			//
			attributes = textAlignFromWPCompatibility({
				attributes,
				blockId,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Text Decoration
			//
			attributes = textDecorationFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Font Appearance
			//
			attributes = fontAppearanceFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Text Transform
			//
			attributes = textTransformFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Letter Spacing
			//
			attributes = letterSpacingFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Text Indent
			//
			attributes = textIndentFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Text Orientation
			//
			attributes = textOrientationFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Text Color
			//
			attributes = fontColorFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			return sanitizeWPCompatibilityAttributes(attributes, blockDetail);
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

			switch (featureId) {
				case 'blockeraFontFamily':
					return mergeWPCompatibility(
						nextState,
						fontFamilyToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraFontAppearance':
					return mergeWPCompatibility(
						nextState,
						fontAppearanceToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraFontSize':
					return mergeWPCompatibility(
						nextState,
						fontSizeToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraLineHeight':
					return mergeWPCompatibility(
						nextState,
						lineHeightToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraTextAlign':
					return mergeWPCompatibility(
						nextState,
						textAlignToWPCompatibility({
							newValue,
							ref,
							blockId,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraTextDecoration':
					return mergeWPCompatibility(
						nextState,
						textDecorationToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraTextTransform':
					return mergeWPCompatibility(
						nextState,
						textTransformToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraLetterSpacing':
					return mergeWPCompatibility(
						nextState,
						letterSpacingToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraTextIndent':
					return mergeWPCompatibility(
						nextState,
						textIndentToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraTextOrientation':
					return mergeWPCompatibility(
						nextState,
						textOrientationToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraFontColor':
					return mergeWPCompatibility(
						nextState,
						fontColorToWPCompatibility({
							newValue,
							ref,
							getAttributes,
							blockDetail,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);
			}

			return nextState;
		}
	);
};

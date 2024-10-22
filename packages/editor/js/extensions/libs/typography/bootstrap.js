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
	fontWeightFromWPCompatibility,
	fontWeightToWPCompatibility,
} from './compatibility/font-weight';
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
	fontStyleFromWPCompatibility,
	fontStyleToWPCompatibility,
} from './compatibility/font-style';
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
import type { BlockDetail } from '../block-states/types';
import { isBlockNotOriginalState, isInvalidCompatibilityRun } from '../utils';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.typographyExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId } = blockDetail;

			if (isBlockNotOriginalState(blockDetail)) {
				return attributes;
			}

			//
			// Font Family
			//
			attributes = fontFamilyFromWPCompatibility({
				attributes,
			});

			//
			// Font Weight
			//
			attributes = fontWeightFromWPCompatibility({
				attributes,
			});

			//
			// Font Size
			//
			attributes = fontSizeFromWPCompatibility({
				attributes,
			});

			//
			// Line Height
			//
			attributes = lineHeightFromWPCompatibility({
				attributes,
			});

			//
			// Text Align
			//
			attributes = textAlignFromWPCompatibility({
				attributes,
				blockId,
			});

			//
			// Text Decoration
			//
			attributes = textDecorationFromWPCompatibility({
				attributes,
			});

			//
			// Font Style
			//
			attributes = fontStyleFromWPCompatibility({
				attributes,
			});

			//
			// Text Transform
			//
			attributes = textTransformFromWPCompatibility({
				attributes,
			});

			//
			// Letter Spacing
			//
			attributes = letterSpacingFromWPCompatibility({
				attributes,
			});

			//
			// Text Orientation
			//
			attributes = textOrientationFromWPCompatibility({
				attributes,
			});

			//
			// Text Color
			//
			attributes = fontColorFromWPCompatibility({
				attributes,
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
			const { blockId } = blockDetail;

			if (isInvalidCompatibilityRun(blockDetail, ref)) {
				return nextState;
			}

			switch (featureId) {
				case 'blockeraFontFamily':
					return mergeObject(
						nextState,
						fontFamilyToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraFontWeight':
					return mergeObject(
						nextState,
						fontWeightToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraFontSize':
					return mergeObject(
						nextState,
						fontSizeToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraLineHeight':
					return mergeObject(
						nextState,
						lineHeightToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraTextAlign':
					return mergeObject(
						nextState,
						textAlignToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);

				case 'blockeraTextDecoration':
					return mergeObject(
						nextState,
						textDecorationToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraFontStyle':
					return mergeObject(
						nextState,
						fontStyleToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraTextTransform':
					return mergeObject(
						nextState,
						textTransformToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraLetterSpacing':
					return mergeObject(
						nextState,
						letterSpacingToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraTextOrientation':
					return mergeObject(
						nextState,
						textOrientationToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraFontColor':
					return mergeObject(
						nextState,
						fontColorToWPCompatibility({
							newValue,
							ref,
							getAttributes,
						})
					);
			}

			return nextState;
		}
	);
};

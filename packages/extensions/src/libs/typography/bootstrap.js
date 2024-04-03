// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import type { ControlContextRef } from '@publisher/controls/src/context/types';
import { mergeObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
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

export const bootstrap = (): void => {
	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.typographyExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return attributes;
			}

			//
			// Font Size
			//
			const fontSizeAttrs = fontSizeFromWPCompatibility({
				attributes,
			});

			if (fontSizeAttrs) {
				attributes = mergeObject(attributes, fontSizeAttrs);
			}

			//
			// Line Height
			//
			const lineHeightAttrs = lineHeightFromWPCompatibility({
				attributes,
			});

			if (lineHeightAttrs) {
				attributes = mergeObject(attributes, lineHeightAttrs);
			}

			//
			// Text Align
			//
			const textAlignAttrs = textAlignFromWPCompatibility({
				attributes,
			});

			if (textAlignAttrs) {
				attributes = mergeObject(attributes, textAlignAttrs);
			}

			//
			// Text Decoration
			//
			const textDecorationAttrs = textDecorationFromWPCompatibility({
				attributes,
			});

			if (textDecorationAttrs) {
				attributes = mergeObject(attributes, textDecorationAttrs);
			}

			//
			// Font Style
			//
			const fontStyleAttrs = fontStyleFromWPCompatibility({
				attributes,
			});

			if (fontStyleAttrs) {
				attributes = mergeObject(attributes, fontStyleAttrs);
			}

			attributes = textTransformFromWPCompatibility({
				attributes,
			});

			//
			// Letter Spacing
			//
			const letterSpacingAttrs = letterSpacingFromWPCompatibility({
				attributes,
			});

			if (letterSpacingAttrs) {
				attributes = mergeObject(attributes, letterSpacingAttrs);
			}

			attributes = textOrientationFromWPCompatibility({
				attributes,
			});

			//
			// Text Color
			//
			const fontColorAttrs = fontColorFromWPCompatibility({
				attributes,
			});

			if (fontColorAttrs) {
				attributes = mergeObject(attributes, fontColorAttrs);
			}

			return attributes;
		}
	);

	addFilter(
		'publisherCore.blockEdit.setAttributes',
		'publisherCore.blockEdit.typographyExtension.bootstrap.setAttributes',
		/**
		 * Retrieve block attributes with WordPress compatibilities.
		 *
		 * @callback getAttributes
		 *
		 * @param {Object} nextState The block attributes changed with publisher feature newValue and latest version of block state.
		 * @param {string} featureId The publisher feature identifier.
		 * @param {*} newValue The newValue sets to feature.
		 * @param {ControlContextRef} ref The reference of control context action occurred.
		 * @param {blockDetail} blockDetail detail of current block
		 *
		 * @return {Object|{}} The retrieve updated block attributes with all of wp compatibilities.
		 */
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRef,
			getAttributes: () => Object,
			blockDetail: BlockDetail
		): Object => {
			const { isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return nextState;
			}

			switch (featureId) {
				case 'publisherFontSize':
					return mergeObject(
						nextState,
						fontSizeToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherLineHeight':
					return mergeObject(
						nextState,
						lineHeightToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherTextAlign':
					return mergeObject(
						nextState,
						textAlignToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherTextDecoration':
					return mergeObject(
						nextState,
						textDecorationToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherFontStyle':
					return mergeObject(
						nextState,
						fontStyleToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherTextTransform':
					return mergeObject(
						nextState,
						textTransformToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherLetterSpacing':
					return mergeObject(
						nextState,
						letterSpacingToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherTextOrientation':
					return mergeObject(
						nextState,
						textOrientationToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherFontColor':
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

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

export const bootstrap = (): void => {
	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.typographyExtension.bootstrap',
		(attributes, blockDetail) => {
			const { isNormalState } = blockDetail;

			if (!isNormalState()) {
				return attributes;
			}

			attributes = fontSizeFromWPCompatibility({
				attributes,
			});

			attributes = lineHeightFromWPCompatibility({
				attributes,
			});

			attributes = textAlignFromWPCompatibility({
				attributes,
			});

			attributes = textDecorationFromWPCompatibility({
				attributes,
			});

			attributes = fontStyleFromWPCompatibility({
				attributes,
			});

			attributes = textTransformFromWPCompatibility({
				attributes,
			});

			attributes = letterSpacingFromWPCompatibility({
				attributes,
			});

			attributes = textOrientationFromWPCompatibility({
				attributes,
			});

			attributes = fontColorFromWPCompatibility({
				attributes,
			});

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
		 * @param {getAttributes} getAttributes The getter block attributes.
		 * @param {isNormalState} isNormalState To check current state is normal or not
		 *
		 * @return {Object|{}} The retrieve updated block attributes with all of wp compatibilities.
		 */
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRef,
			getAttributes: () => Object,
			isNormalState: () => boolean
		): Object => {
			if (!isNormalState()) {
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
						})
					);
			}

			return nextState;
		}
	);
};

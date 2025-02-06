// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { getBaseBreakpoint } from '@blockera/editor';
import { mergeObject } from '@blockera/utils';
import { isBorderEmpty, type ControlContextRef } from '@blockera/controls';
import type { BlockDetail } from '@blockera/editor/js/extensions/libs/block-states/types';

/**
 * Internal dependencies
 */
import {
	colorFromWPCompatibility,
	colorToWPCompatibility,
} from '../blocksy-shared/compatibility/color';
import {
	colorHoverFromWPCompatibility,
	colorHoverToWPCompatibility,
} from '../blocksy-shared/compatibility/color-hover';
import {
	borderFromWPCompatibility,
	borderToWPCompatibility,
} from '../blocksy-shared/compatibility/border';
import {
	borderHoverFromWPCompatibility,
	borderHoverToWPCompatibility,
} from '../blocksy-shared/compatibility/border-hover';

export const bootstrapBlocksyAboutMe = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.BlocksyAboutMe.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId } = blockDetail;

			if (blockId !== 'blocksy/about-me') {
				return attributes;
			}

			//
			// Text color only
			//
			if (!attributes?.blockeraFontColor?.value) {
				attributes = colorFromWPCompatibility({
					attributes,
					element: 'elements/text',
					property: 'textColor',
					propertyCustom: 'customTextColor',
					blockeraProperty: 'blockeraFontColor',
				});
			}

			//
			// Text hover color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/text']?.attributes
					?.blockeraBlockStates?.hover?.attributes?.blockeraFontColor
			) {
				attributes = colorHoverFromWPCompatibility({
					attributes,
					element: 'elements/text',
					property: 'textHoverColor',
					propertyCustom: 'customTextHoverColor',
					blockeraProperty: 'blockeraFontColor',
				});
			}

			//
			// Icons color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/icons']?.attributes
					?.blockeraFontColor
			) {
				attributes = colorFromWPCompatibility({
					attributes,
					element: 'elements/icons',
					property: 'iconsColor',
					propertyCustom: 'customIconsColor',
					blockeraProperty: 'blockeraFontColor',
				});
			}

			//
			// Icons hover color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/icons']?.attributes
					?.blockeraBlockStates?.hover?.attributes?.blockeraFontColor
			) {
				attributes = colorHoverFromWPCompatibility({
					attributes,
					element: 'elements/icons',
					property: 'iconsHoverColor',
					propertyCustom: 'customIconsHoverColor',
					blockeraProperty: 'blockeraFontColor',
				});
			}

			//
			// Border color only
			//
			if (
				attributes?.blockeraInnerBlocks['elements/icons']?.attributes
					?.blockeraBorder === undefined ||
				isBorderEmpty(
					attributes?.blockeraInnerBlocks['elements/icons']
						?.attributes?.blockeraBorder
				)
			) {
				attributes = borderFromWPCompatibility({
					attributes,
					element: 'elements/icons',
					property: 'borderColor',
					propertyCustom: 'customBorderColor',
					blockeraProperty: 'blockeraBorder',
				});
			}

			//
			// Border color only
			//
			if (
				attributes?.blockeraInnerBlocks['elements/icons']?.attributes
					?.blockeraBlockStates?.hover?.breakpoints[
					getBaseBreakpoint()
				]?.attributes?.blockeraBorder === undefined ||
				isBorderEmpty(
					attributes?.blockeraInnerBlocks['elements/icons']
						?.attributes?.blockeraBlockStates?.hover?.breakpoints[
						getBaseBreakpoint()
					]?.attributes?.blockeraBorder
				)
			) {
				attributes = borderHoverFromWPCompatibility({
					attributes,
					element: 'elements/icons',
					property: 'borderHoverColor',
					propertyCustom: 'customBorderHoverColor',
					blockeraProperty: 'blockeraBorder',
				});
			}

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.BlocksyAboutMe.bootstrap.setAttributes',
		/**
		 * Retrieve block attributes with WordPress compatibilities.
		 *
		 * @callback getAttributes
		 *
		 * @param {Object} nextState The block attributes changed with blockera feature newValue and latest version of block state.
		 * @param {string} featureId The blockera feature identifier.
		 * @param {*} newValue The newValue sets to feature.
		 * @param {ControlContextRef} ref The reference of control context action occurred.
		 * @param {getAttributes} getAttributes The getter block attributes.
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
			const { blockId, isBaseBreakpoint, currentBlock, currentState } =
				blockDetail;

			if (blockId !== 'blocksy/about-me') {
				return nextState;
			}

			//
			// text color
			// only in elements/text inner block
			//
			if (
				isBaseBreakpoint &&
				currentState === 'normal' &&
				currentBlock === 'elements/text' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					colorToWPCompatibility({
						newValue,
						ref,
						property: 'textColor',
						propertyCustom: 'customTextColor',
					})
				);
			}

			//
			// text hover color
			// only in elements/text inner block
			//
			if (
				isBaseBreakpoint &&
				currentState === 'hover' &&
				currentBlock === 'elements/text' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					colorHoverToWPCompatibility({
						newValue,
						ref,
						property: 'textHoverColor',
						propertyCustom: 'customTextHoverColor',
					})
				);
			}

			//
			// icons color
			// only in elements/icons inner block
			//
			if (
				isBaseBreakpoint &&
				currentState === 'normal' &&
				currentBlock === 'elements/icons' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					colorToWPCompatibility({
						newValue,
						ref,
						property: 'iconsColor',
						propertyCustom: 'customIconsColor',
					})
				);
			}

			//
			// icons hover color
			// only in elements/icons inner block
			//
			if (
				isBaseBreakpoint &&
				currentState === 'hover' &&
				currentBlock === 'elements/icons' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					colorHoverToWPCompatibility({
						newValue,
						ref,
						property: 'iconsHoverColor',
						propertyCustom: 'customIconsHoverColor',
					})
				);
			}

			//
			// border color
			// only in elements/icons inner block
			//
			if (
				isBaseBreakpoint &&
				currentState === 'normal' &&
				currentBlock === 'elements/icons' &&
				featureId === 'blockeraBorder'
			) {
				return mergeObject(
					nextState,
					borderToWPCompatibility({
						newValue,
						ref,
						property: 'borderColor',
						propertyCustom: 'customBorderColor',
					})
				);
			}

			//
			// border hover color
			// only in elements/icons inner block
			//
			if (
				isBaseBreakpoint &&
				currentState === 'hover' &&
				currentBlock === 'elements/icons' &&
				featureId === 'blockeraBorder'
			) {
				return mergeObject(
					nextState,
					borderHoverToWPCompatibility({
						newValue,
						ref,
						property: 'borderHoverColor',
						propertyCustom: 'customBorderHoverColor',
					})
				);
			}

			return nextState;
		}
	);
};

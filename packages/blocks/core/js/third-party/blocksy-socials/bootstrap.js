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
	colorStateFromWPCompatibility,
	colorStateToWPCompatibility,
} from '../blocksy-shared/compatibility/color-state';
import {
	borderFromWPCompatibility,
	borderToWPCompatibility,
} from '../blocksy-shared/compatibility/border';
import {
	borderStateFromWPCompatibility,
	borderStateToWPCompatibility,
} from '../blocksy-shared/compatibility/border-state';
import { bgColorFromWPCompatibility } from '../blocksy-shared/compatibility/bg-color';
import { bgColorStateFromWPCompatibility } from '../blocksy-shared/compatibility/bg-color-state';

export const bootstrapBlocksySocials = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.BlocksySocials.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId } = blockDetail;

			if (blockId !== 'blocksy/socials') {
				return attributes;
			}

			//
			// BG color only
			//
			if (!attributes?.blockeraBackgroundColor?.value) {
				attributes = bgColorFromWPCompatibility({
					attributes,
					element: 'elements/icons',
					property: 'backgroundColor',
					propertyCustom: 'customBackgroundColor',
					blockeraProperty: 'blockeraBackgroundColor',
					defaultValue: 'rgba(218, 222, 228, 0.5)',
				});
			}

			//
			// BG hover color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/icons']?.attributes
					?.blockeraBlockStates?.hover?.attributes
					?.blockeraBackgroundColor
			) {
				attributes = bgColorStateFromWPCompatibility({
					attributes,
					element: 'elements/icons',
					property: 'backgroundHoverColor',
					propertyCustom: 'customBackgroundHoverColor',
					blockeraProperty: 'blockeraBackgroundColor',
					defaultValue: 'rgba(218, 222, 228, 0.7)',
					state: 'hover',
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
					property: 'initialColor',
					propertyCustom: 'customInitialColor',
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
				attributes = colorStateFromWPCompatibility({
					attributes,
					element: 'elements/icons',
					property: 'hoverColor',
					propertyCustom: 'customHoverColor',
					blockeraProperty: 'blockeraFontColor',
					state: 'hover',
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
			// Border hover color only
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
				attributes = borderStateFromWPCompatibility({
					attributes,
					element: 'elements/icons',
					property: 'borderHoverColor',
					propertyCustom: 'customBorderHoverColor',
					blockeraProperty: 'blockeraBorder',
					state: 'hover',
				});
			}

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.BlocksySocials.bootstrap.setAttributes',
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

			if (blockId !== 'blocksy/socials') {
				return nextState;
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
						property: 'initialColor',
						propertyCustom: 'customInitialColor',
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
					colorStateToWPCompatibility({
						newValue,
						ref,
						property: 'hoverColor',
						propertyCustom: 'customHoverColor',
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
					borderStateToWPCompatibility({
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

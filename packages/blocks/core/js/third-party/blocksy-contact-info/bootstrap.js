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
	textColorFromWPCompatibility,
	textColorToWPCompatibility,
} from './compatibility/text-color';
import {
	linkColorFromWPCompatibility,
	linkColorToWPCompatibility,
} from './compatibility/link-color';
import {
	linkColorHoverFromWPCompatibility,
	linkColorHoverToWPCompatibility,
} from './compatibility/link-hover-color';
import {
	iconsColorFromWPCompatibility,
	iconsColorToWPCompatibility,
} from './compatibility/icons-color';
import {
	iconsColorHoverFromWPCompatibility,
	iconsColorHoverToWPCompatibility,
} from './compatibility/icons-hover-color';
import {
	borderColorFromWPCompatibility,
	borderColorToWPCompatibility,
} from './compatibility/icon-border-color';
import {
	borderHoverColorFromWPCompatibility,
	borderHoverColorToWPCompatibility,
} from './compatibility/icon-border-hover-color';

export const bootstrapBlocksyContactInfo = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.BlocksyContactInfo.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId } = blockDetail;

			if (blockId !== 'blocksy/contact-info') {
				return attributes;
			}

			//
			// Text color only
			//
			if (!attributes?.blockeraFontColor?.value) {
				attributes = textColorFromWPCompatibility({
					attributes,
				});
			}

			//
			// Link color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/link']?.attributes
					?.blockeraFontColor
			) {
				attributes = linkColorFromWPCompatibility({
					attributes,
				});
			}

			//
			// Link hover color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/text']?.attributes
					?.blockeraBlockStates?.hover?.attributes?.blockeraFontColor
			) {
				attributes = linkColorHoverFromWPCompatibility({
					attributes,
				});
			}

			//
			// Icons color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/icons']?.attributes
					?.blockeraFontColor
			) {
				attributes = iconsColorFromWPCompatibility({
					attributes,
				});
			}

			//
			// Icons hover color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/icons']?.attributes
					?.blockeraBlockStates?.hover?.attributes?.blockeraFontColor
			) {
				attributes = iconsColorHoverFromWPCompatibility({
					attributes,
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
				attributes = borderColorFromWPCompatibility({
					attributes,
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
				attributes = borderHoverColorFromWPCompatibility({
					attributes,
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

			if (blockId !== 'blocksy/contact-info') {
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
					textColorToWPCompatibility({
						newValue,
						ref,
					})
				);
			}

			//
			// link color
			// only in elements/link inner block
			//
			if (
				isBaseBreakpoint &&
				currentState === 'normal' &&
				currentBlock === 'elements/link' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					linkColorToWPCompatibility({
						newValue,
						ref,
					})
				);
			}

			//
			// link hover color
			// only in elements/text inner block
			//
			if (
				isBaseBreakpoint &&
				currentState === 'hover' &&
				currentBlock === 'elements/link' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					linkColorHoverToWPCompatibility({
						newValue,
						ref,
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
					iconsColorToWPCompatibility({
						newValue,
						ref,
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
					iconsColorHoverToWPCompatibility({
						newValue,
						ref,
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
					borderColorToWPCompatibility({
						newValue,
						ref,
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
					borderHoverColorToWPCompatibility({
						newValue,
						ref,
					})
				);
			}

			return nextState;
		}
	);
};

// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import type { BlockDetail } from '@blockera/editor/js/extensions/libs/block-states/types';
import type { ControlContextRef } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	textColorFromWPCompatibility,
	textColorToWPCompatibility,
} from './compatibility/text-color';
import {
	textColorHoverFromWPCompatibility,
	textColorHoverToWPCompatibility,
} from './compatibility/text-hover-color';

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
				attributes = textColorFromWPCompatibility({
					attributes,
				});
			}

			//
			// Text hover color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/text']?.attributes
					?.blockeraFontColor
			) {
				attributes = textColorHoverFromWPCompatibility({
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
					textColorToWPCompatibility({
						newValue,
						ref,
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
					textColorHoverToWPCompatibility({
						newValue,
						ref,
					})
				);
			}

			return nextState;
		}
	);
};

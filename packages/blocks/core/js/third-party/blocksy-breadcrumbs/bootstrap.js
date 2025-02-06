// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import { getBaseBreakpoint } from '@blockera/editor';
import { isBlockNotOriginalState } from '@blockera/editor/js/extensions/libs/utils';
import type { BlockDetail } from '@blockera/editor/js/extensions/libs/block-states/types';
import type { ControlContextRef } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	textColorFromWPCompatibility,
	textColorToWPCompatibility,
} from '../blocksy-shared/compatibility/text-color';
import {
	linkColorFromWPCompatibility,
	linkColorToWPCompatibility,
} from '../blocksy-shared/compatibility/link-color';
import {
	linkColorHoverFromWPCompatibility,
	linkColorHoverToWPCompatibility,
} from '../blocksy-shared/compatibility/link-hover-color';

export const bootstrapBlocksyBreadcrumbs = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.BlocksyBreadcrumbs.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId } = blockDetail;

			if (
				blockId !== 'blocksy/breadcrumbs' ||
				isBlockNotOriginalState(blockDetail)
			) {
				return attributes;
			}

			//
			// Text color only on base device and normal state
			//
			if (
				!isBlockNotOriginalState(blockDetail) &&
				!attributes?.blockeraFontColor?.value
			) {
				attributes = textColorFromWPCompatibility({
					attributes,
					element: 'elements/text',
				});
			}

			//
			// Link color only on base device and normal state
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/links']?.attributes
					?.blockeraFontColor
			) {
				attributes = linkColorFromWPCompatibility({
					attributes,
					element: 'elements/links',
				});
			}

			//
			// Link hover color only on base device and hover state
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/links']?.attributes
					?.blockeraBlockStates?.hover?.breakpoints[
					getBaseBreakpoint()
				]?.attributes?.blockeraFontColor
			) {
				attributes = linkColorHoverFromWPCompatibility({
					attributes,
					element: 'elements/links',
				});
			}

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.BlocksyBreadcrumbs.bootstrap.setAttributes',
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

			if (blockId !== 'blocksy/breadcrumbs') {
				return nextState;
			}

			//
			// text color
			// only in elements/text inner block
			//
			if (
				isBaseBreakpoint &&
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
			// Link color in normal state state
			//
			if (
				isBaseBreakpoint &&
				currentState === 'normal' &&
				currentBlock === 'elements/links' &&
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
			// Link color in hover state
			//
			if (
				isBaseBreakpoint &&
				currentState === 'hover' &&
				currentBlock === 'elements/links' &&
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

			return nextState;
		}
	);
};

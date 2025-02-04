// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import { isBlockNotOriginalState } from '@blockera/editor/js/extensions/libs/utils';
import type { BlockDetail } from '@blockera/editor/js/extensions/libs/block-states/types';
import type { ControlContextRef } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	textColorFromWPCompatibility,
	textColorToWPCompatibility,
} from './compatibility/text-color';

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

			if (!attributes?.blockeraFontColor?.value) {
				attributes = textColorFromWPCompatibility({
					attributes,
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
			const { blockId, isBaseBreakpoint, currentBlock } = blockDetail;

			if (blockId !== 'blocksy/breadcrumbs' || !isBaseBreakpoint) {
				return nextState;
			}

			//
			// text color
			// only in elements/text inner block
			//
			if (
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

			return nextState;
		}
	);
};

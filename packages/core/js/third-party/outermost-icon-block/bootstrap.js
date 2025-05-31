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
import type { BlockDetail } from '@blockera/editor/js/extensions/libs/block-card/block-states/types';
import type { ControlContextRef } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	iconColorFromWPCompatibility,
	iconColorToWPCompatibility,
} from './compatibility/icon-color';

import {
	iconBackgroundColorFromWPCompatibility,
	iconBackgroundColorToWPCompatibility,
} from './compatibility/icon-background-color';

export const bootstrapOutermostIconBlock = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.OutermostIconBlock.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId } = blockDetail;

			if (
				blockId !== 'outermost/icon-block' ||
				isBlockNotOriginalState(blockDetail)
			) {
				return attributes;
			}

			if (!attributes?.blockeraFontColor?.value) {
				attributes = iconColorFromWPCompatibility({
					attributes,
				});
			}

			if (!attributes?.blockeraBackgroundColor?.value) {
				attributes = iconBackgroundColorFromWPCompatibility({
					attributes,
				});
			}

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.OutermostIconBlock.bootstrap.setAttributes',
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
			const { blockId, isBaseBreakpoint, isMasterBlock } = blockDetail;

			if (
				blockId !== 'outermost/icon-block' ||
				!isBaseBreakpoint ||
				!isMasterBlock
			) {
				return nextState;
			}

			//
			// icon color
			//
			if (featureId === 'blockeraFontColor') {
				return mergeObject(
					nextState,
					iconColorToWPCompatibility({
						newValue,
						ref,
					})
				);
			}

			//
			// icon background color
			//
			if (featureId === 'blockeraBackgroundColor') {
				return mergeObject(
					nextState,
					iconBackgroundColorToWPCompatibility({
						newValue,
						ref,
					})
				);
			}

			return nextState;
		}
	);
};

// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import type { ControlContextRef } from '@publisher/controls/src/context/types';

/**
 * Internal dependencies
 */
import type { BlockDetail } from '../block-states/types';
import {
	linkFromWPCompatibility,
	linkInnerBlockSupportedBlocks,
	linkToWPCompatibility,
} from './compatibility/link';
import { mergeObject } from '@publisher/utils';

export const bootstrap = (): void => {
	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.sizeExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return attributes;
			}

			if (linkInnerBlockSupportedBlocks.includes(blockId)) {
				attributes = linkFromWPCompatibility({
					attributes,
				});
			}

			return attributes;
		}
	);

	addFilter(
		'publisherCore.blockEdit.setAttributes',
		'publisherCore.blockEdit.sizeExtension.bootstrap.setAttributes',
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
			const {
				blockId,
				isBaseBreakpoint,
				isMasterBlock,
				currentState,
				currentBlock,
			} = blockDetail;

			if (!isBaseBreakpoint || isMasterBlock) {
				return nextState;
			}

			// Handle "link" inner block changes.
			if (currentBlock === 'link') {
				if (
					currentState === 'normal' &&
					linkInnerBlockSupportedBlocks.includes(blockId)
				) {
					switch (featureId) {
						case 'publisherFontColor':
							return mergeObject(
								nextState,
								linkToWPCompatibility({
									newValue,
									ref,
								})
							);
					}
				}

				// todo add hover color
			}

			return nextState;
		}
	);
};

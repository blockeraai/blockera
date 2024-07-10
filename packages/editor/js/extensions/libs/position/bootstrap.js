// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import type { ControlContextRef } from '@blockera/controls';
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	positionFromWPCompatibility,
	positionToWPCompatibility,
} from './compatibility/position';
import type { BlockDetail } from '../block-states/types';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.sizeExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return attributes;
			}

			if (blockId === 'core/group') {
				attributes = positionFromWPCompatibility({
					attributes,
				});
			}

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.sizeExtension.bootstrap.setAttributes',
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
			const { blockId, isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return nextState;
			}

			if (featureId === 'blockeraPosition' && blockId === 'core/group') {
				return mergeObject(
					nextState,
					positionToWPCompatibility({
						newValue,
						ref,
					})
				);
			}

			return nextState;
		}
	);
};

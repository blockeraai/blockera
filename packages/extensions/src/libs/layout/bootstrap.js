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
	displayFromWPCompatibility,
	displayToWPCompatibility,
} from './compatibility/display';

import type { BlockDetail } from '../block-states/types';

/**
 * Blocks
 * -> Group
 * -> Buttons
 */
export const bootstrap = (): void => {
	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.layoutExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return attributes;
			}

			attributes = displayFromWPCompatibility({
				attributes,
				blockId,
			});

			return attributes;
		}
	);

	addFilter(
		'publisherCore.blockEdit.setAttributes',
		'publisherCore.blockEdit.layoutExtension.bootstrap.setAttributes',
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
			const { blockId, isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return nextState;
			}

			switch (featureId) {
				case 'publisherDisplay':
					return mergeObject(
						nextState,
						displayToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);
			}

			return nextState;
		}
	);
};

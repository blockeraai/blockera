// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import type { ControlContextRef } from '@blockera/controls';

/**
 * Internal dependencies
 */

import {
	displayFromWPCompatibility,
	displayToWPCompatibility,
} from './compatibility/display';
import {
	flexWrapFromWPCompatibility,
	flexWrapToWPCompatibility,
} from './compatibility/flex-wrap';
import {
	flexLayoutToWPCompatibility,
	alignItemsFromWPCompatibility,
	justifyContentFromWPCompatibility,
	directionFromWPCompatibility,
} from './compatibility/flex-layout';

import type { BlockDetail } from '../block-states/types';

/**
 * Blocks
 * -> Group
 * -> Buttons
 */
export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.layoutExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return attributes;
			}

			//
			// Display compatibility
			//
			const displayAttrs = displayFromWPCompatibility({
				attributes,
				blockId,
			});

			if (displayAttrs) {
				attributes = mergeObject(attributes, displayAttrs);
			}

			//
			// Flex wrap compatibility
			//
			const flexWrapAttrs = flexWrapFromWPCompatibility({
				attributes,
			});

			if (flexWrapAttrs) {
				attributes = mergeObject(attributes, flexWrapAttrs);
			}

			//
			// direction compatibility
			//
			const directionAttrs = directionFromWPCompatibility({
				attributes,
			});

			if (directionAttrs) {
				attributes = mergeObject(attributes, directionAttrs);
			}

			//
			// Align items compatibility
			//
			const alignItemsAttrs = alignItemsFromWPCompatibility({
				attributes,
			});

			if (alignItemsAttrs) {
				attributes = mergeObject(attributes, alignItemsAttrs);
			}

			//
			// Justify content compatibility
			//
			const justifyContentAttrs = justifyContentFromWPCompatibility({
				attributes,
			});

			if (justifyContentAttrs) {
				attributes = mergeObject(attributes, justifyContentAttrs);
			}

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.layoutExtension.bootstrap.setAttributes',
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
			const {
				blockId,
				isNormalState,
				isBaseBreakpoint,
				isMasterBlock,
				blockAttributes,
			} = blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return nextState;
			}

			switch (featureId) {
				case 'blockeraDisplay':
					return mergeObject(
						nextState,
						displayToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);

				case 'blockeraFlexWrap':
					return mergeObject(
						nextState,
						flexWrapToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraFlexLayout':
					return mergeObject(
						nextState,
						flexLayoutToWPCompatibility({
							newValue,
							ref,
							defaultValue:
								blockAttributes?.blockeraFlexLayout?.default,
						})
					);
			}

			return nextState;
		}
	);
};

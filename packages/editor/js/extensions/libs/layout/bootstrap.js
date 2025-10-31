// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import type { ControlContextRefCurrent } from '@blockera/controls';

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
import {
	gapFromWPCompatibility,
	gapToWPCompatibility,
} from './compatibility/gap';

import type { BlockDetail } from '../block-card/block-states/types';
import { isBlockNotOriginalState, isInvalidCompatibilityRun } from '../utils';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.layoutExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, blockAttributes, activeBlockVariation } =
				blockDetail;

			if (isBlockNotOriginalState(blockDetail)) {
				return attributes;
			}

			//
			// Display compatibility
			//
			attributes = displayFromWPCompatibility({
				attributes,
				blockId,
				defaultValue: blockAttributes.blockeraDisplay.default,
				//$FlowFixMe
				activeVariation: activeBlockVariation?.name,
			});

			//
			// Flex wrap compatibility
			//
			attributes = flexWrapFromWPCompatibility({
				attributes,
			});

			//
			// direction compatibility
			//
			attributes = directionFromWPCompatibility({
				attributes,
				blockId,
				//$FlowFixMe
				activeVariation: activeBlockVariation?.name,
			});

			//
			// Align items compatibility
			//
			attributes = alignItemsFromWPCompatibility({
				attributes,
			});

			//
			// Justify content compatibility
			//
			attributes = justifyContentFromWPCompatibility({
				attributes,
			});

			//
			// Block gap compatibility
			//
			attributes = gapFromWPCompatibility({
				attributes,
			});

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
		 * @param {ControlContextRefCurrent} ref The reference of control context action occurred.
		 * @param {getAttributes} getAttributes The getter block attributes.
		 * @param {blockDetail} blockDetail detail of current block
		 *
		 * @return {Object|{}} The retrieve updated block attributes with all of wp compatibilities.
		 */
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRefCurrent,
			getAttributes: () => Object,
			blockDetail: BlockDetail
		): Object => {
			const { blockId, blockAttributes, activeBlockVariation } =
				blockDetail;

			if (isInvalidCompatibilityRun(blockDetail, ref)) {
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
							//$FlowFixMe
							activeVariation: activeBlockVariation?.name,
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

				case 'blockeraGap':
					return mergeObject(
						nextState,
						gapToWPCompatibility({
							newValue,
							ref,
							defaultValue: blockAttributes?.blockeraGap?.default,
							blockId,
						})
					);
			}

			return nextState;
		}
	);
};

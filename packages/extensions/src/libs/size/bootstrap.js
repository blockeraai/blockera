// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import type { ControlContextRef } from '@blockera/controls/src/context/types';
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	widthFromWPCompatibility,
	widthToWPCompatibility,
} from './compatibility/width';
import {
	heightFromWPCompatibility,
	heightToWPCompatibility,
} from './compatibility/height';
import {
	minHeightFromWPCompatibility,
	minHeightToWPCompatibility,
} from './compatibility/min-height';
import {
	ratioFromWPCompatibility,
	ratioToWPCompatibility,
} from './compatibility/aspect-ratio';
import {
	fitFromWPCompatibility,
	fitToWPCompatibility,
} from './compatibility/fit';
import type { BlockDetail } from '../block-states/types';

export const bootstrap = (): void => {
	addFilter(
		'blockeraCore.blockEdit.attributes',
		'blockeraCore.blockEdit.sizeExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return attributes;
			}

			attributes = widthFromWPCompatibility({
				attributes,
				blockId,
			});

			attributes = heightFromWPCompatibility({
				attributes,
				blockId,
			});

			attributes = minHeightFromWPCompatibility({
				attributes,
				blockId,
			});

			attributes = ratioFromWPCompatibility({
				attributes,
				blockId,
			});

			attributes = fitFromWPCompatibility({
				attributes,
				blockId,
			});

			return attributes;
		}
	);

	addFilter(
		'blockeraCore.blockEdit.setAttributes',
		'blockeraCore.blockEdit.sizeExtension.bootstrap.setAttributes',
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

			switch (featureId) {
				case 'blockeraWidth':
					return mergeObject(
						nextState,
						widthToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);

				case 'blockeraHeight':
					return mergeObject(
						nextState,
						heightToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);

				case 'blockeraMinHeight':
					return mergeObject(
						nextState,
						minHeightToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);

				case 'blockeraRatio':
					return mergeObject(
						nextState,
						ratioToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);

				case 'blockeraFit':
					return mergeObject(
						nextState,
						fitToWPCompatibility({
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

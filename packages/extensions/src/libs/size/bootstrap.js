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
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.sizeExtension.bootstrap',
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
			const { blockId, isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return nextState;
			}

			switch (featureId) {
				case 'publisherWidth':
					return mergeObject(
						nextState,
						widthToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);

				case 'publisherHeight':
					return mergeObject(
						nextState,
						heightToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);

				case 'publisherMinHeight':
					return mergeObject(
						nextState,
						minHeightToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);

				case 'publisherRatio':
					return mergeObject(
						nextState,
						ratioToWPCompatibility({
							newValue,
							ref,
							blockId,
						})
					);

				case 'publisherFit':
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

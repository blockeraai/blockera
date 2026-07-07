// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import type { ControlContextRefCurrent } from '@blockera/controls';

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
import type { BlockDetail } from '../block-card/block-states/types';
import {
	isInvalidCompatibilityRun,
	mergeWPCompatibility,
	sanitizeWPCompatibilityAttributes,
} from '../utils';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.sizeExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, insideBlockInspector, editorSelectedBlockEvent } =
				blockDetail;

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
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			attributes = ratioFromWPCompatibility({
				attributes,
				blockId,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			attributes = fitFromWPCompatibility({
				attributes,
				blockId,
			});

			return sanitizeWPCompatibilityAttributes(attributes, blockDetail);
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
			const { blockId, insideBlockInspector, editorSelectedBlockEvent } =
				blockDetail;

			if (isInvalidCompatibilityRun(blockDetail, ref)) {
				return nextState;
			}

			switch (featureId) {
				case 'blockeraWidth':
					return mergeWPCompatibility(
						nextState,
						widthToWPCompatibility({
							newValue,
							ref,
							blockId,
						}),
						blockDetail
					);

				case 'blockeraHeight':
					return mergeWPCompatibility(
						nextState,
						heightToWPCompatibility({
							newValue,
							ref,
							blockId,
						}),
						blockDetail
					);

				case 'blockeraMinHeight':
					return mergeWPCompatibility(
						nextState,
						minHeightToWPCompatibility({
							newValue,
							ref,
							blockId,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraRatio':
					return mergeWPCompatibility(
						nextState,
						ratioToWPCompatibility({
							newValue,
							ref,
							blockId,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraFit':
					return mergeWPCompatibility(
						nextState,
						fitToWPCompatibility({
							newValue,
							ref,
							blockId,
						}),
						blockDetail
					);
			}

			return nextState;
		}
	);
};

// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import type { ControlContextRefCurrent } from '@blockera/controls';
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	positionFromWPCompatibility,
	positionToWPCompatibility,
} from './compatibility/position';
import type { BlockDetail } from '../block-card/block-states/types';
import { isBlockNotOriginalState, isInvalidCompatibilityRun } from '../utils';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.positionExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, insideBlockInspector, editorSelectedBlockEvent } =
				blockDetail;

			if (isBlockNotOriginalState(blockDetail)) {
				return attributes;
			}

			const runSelectedBlockEvent = [
				'save-customizations',
				'detach-style',
			].includes(editorSelectedBlockEvent);

			if (blockId === 'core/group') {
				attributes = positionFromWPCompatibility({
					attributes,
					insideBlockInspector,
					runSelectedBlockEvent,
				});
			}

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.positionExtension.bootstrap.setAttributes',
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

			const runSelectedBlockEvent = [
				'save-customizations',
				'detach-style',
			].includes(editorSelectedBlockEvent);

			if (featureId === 'blockeraPosition' && blockId === 'core/group') {
				return mergeObject(
					nextState,
					positionToWPCompatibility({
						newValue,
						ref,
						insideBlockInspector,
						runSelectedBlockEvent,
					})
				);
			}

			return nextState;
		}
	);
};

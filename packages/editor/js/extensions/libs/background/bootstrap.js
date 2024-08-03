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
	backgroundFromWPCompatibility,
	backgroundToWPCompatibility,
} from './compatibility/background-image';
import { mergeObject } from '@blockera/utils';
import {
	backgroundColorFromWPCompatibility,
	backgroundColorToWPCompatibility,
} from './compatibility/background-color';
import type { BlockDetail } from '../block-states/types';
import { isBlockNotOriginalState, isInvalidCompatibilityRun } from '../utils';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.backgroundExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId, blockAttributes } = blockDetail;

			if (!isBlockNotOriginalState(blockDetail)) {
				return attributes;
			}

			attributes = backgroundFromWPCompatibility({
				attributes,
				blockId,
			});

			attributes = backgroundColorFromWPCompatibility({
				attributes,
				blockAttributes,
			});

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.backgroundExtension.bootstrap.setAttributes',
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
			if (isInvalidCompatibilityRun(blockDetail, ref)) {
				return nextState;
			}

			switch (featureId) {
				case 'blockeraBackground':
					return mergeObject(
						nextState,
						backgroundToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraBackgroundColor':
					return mergeObject(
						nextState,
						backgroundColorToWPCompatibility({
							newValue,
							ref,
						})
					);
			}

			return nextState;
		}
	);
};

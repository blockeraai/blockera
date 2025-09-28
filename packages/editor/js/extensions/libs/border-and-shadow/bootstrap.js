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
	borderFromWPCompatibility,
	borderToWPCompatibility,
} from './compatibilities/border';
import {
	borderRadiusFromWPCompatibility,
	borderRadiusToWPCompatibility,
} from './compatibilities/border-radius';
import type { BlockDetail } from '../block-card/block-states/types';
import { isBlockNotOriginalState, isInvalidCompatibilityRun } from '../utils';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.typographyExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			if (isBlockNotOriginalState(blockDetail)) {
				return attributes;
			}

			attributes = borderFromWPCompatibility({
				attributes,
			});

			attributes = borderRadiusFromWPCompatibility({
				attributes,
			});

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.typographyExtension.bootstrap.setAttributes',
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
			if (isInvalidCompatibilityRun(blockDetail)) {
				return nextState;
			}

			switch (featureId) {
				case 'blockeraBorder':
					return mergeObject(
						nextState,
						borderToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'blockeraBorderRadius':
					return mergeObject(
						nextState,
						borderRadiusToWPCompatibility({
							newValue,
							ref,
						})
					);
			}

			return nextState;
		}
	);
};

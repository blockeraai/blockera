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
	borderFromWPCompatibility,
	borderToWPCompatibility,
} from './compatibilities/border';
import {
	borderRadiusFromWPCompatibility,
	borderRadiusToWPCompatibility,
} from './compatibilities/border-radius';
import type { BlockDetail } from '../block-states/types';

export const bootstrap = (): void => {
	addFilter(
		'blockeraCore.blockEdit.attributes',
		'blockeraCore.blockEdit.typographyExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
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
		'blockeraCore.blockEdit.setAttributes',
		'blockeraCore.blockEdit.typographyExtension.bootstrap.setAttributes',
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
			const { isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
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

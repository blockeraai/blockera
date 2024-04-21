// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import type { ControlContextRef } from '@publisher/controls/src/context/types';

/**
 * Internal dependencies
 */
import {
	backgroundFromWPCompatibility,
	backgroundToWPCompatibility,
} from './compatibility/background-image';
import { mergeObject } from '@publisher/utils';
import {
	backgroundColorFromWPCompatibility,
	backgroundColorToWPCompatibility,
} from './compatibility/background-color';
import type { BlockDetail } from '../block-states/types';

export const bootstrap = (): void => {
	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.backgroundExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const {
				blockId,
				isNormalState,
				isMasterBlock,
				blockAttributes,
				isBaseBreakpoint,
			} = blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
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
		'publisherCore.blockEdit.setAttributes',
		'publisherCore.blockEdit.backgroundExtension.bootstrap.setAttributes',
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
			const { isNormalState, isBaseBreakpoint, isMasterBlock } =
				blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return nextState;
			}

			switch (featureId) {
				case 'publisherBackground':
					return mergeObject(
						nextState,
						backgroundToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherBackgroundColor':
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

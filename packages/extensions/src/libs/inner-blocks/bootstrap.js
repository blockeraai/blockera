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
import type { BlockDetail } from '../block-states/types';
import { linkElementSupportedBlocks } from './compatibility/link';
import { mergeObject } from '@publisher/utils';
import {
	elementNormalFontColorFromWPCompatibility,
	elementHoverFontColorFromWPCompatibility,
	elementNormalFontColorToWPCompatibility,
	elementHoverFontColorToWPCompatibility,
} from './compatibility/element-font-color';

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

			if (
				attributes?.style?.elements?.link &&
				linkElementSupportedBlocks.includes(blockId)
			) {
				// Link normal font color
				if (
					!attributes?.publisherInnerBlocks?.link?.attributes
						?.publisherFontColor
				) {
					const newAttributes =
						elementNormalFontColorFromWPCompatibility({
							element: 'link',
							attributes,
						});

					if (newAttributes) {
						attributes = mergeObject(attributes, newAttributes);
					}
				}

				// Link hover font color
				if (
					!attributes?.publisherInnerBlocks?.link?.attributes
						?.publisherBlockStates?.breakpoints?.laptop?.attributes
						?.publisherFontColor
				) {
					const newAttributes =
						elementHoverFontColorFromWPCompatibility({
							element: 'link',
							attributes,
						});

					if (newAttributes) {
						attributes = mergeObject(attributes, newAttributes);
					}
				}
			}

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
			const {
				blockId,
				isBaseBreakpoint,
				isMasterBlock,
				currentState,
				currentBlock,
			} = blockDetail;

			if (!isBaseBreakpoint || isMasterBlock) {
				return nextState;
			}

			// Handle "link" inner block changes.
			if (
				currentBlock === 'link' &&
				linkElementSupportedBlocks.includes(blockId)
			) {
				if (currentState === 'normal') {
					switch (featureId) {
						case 'publisherFontColor':
							return mergeObject(
								nextState,
								elementNormalFontColorToWPCompatibility({
									element: 'link',
									newValue,
									ref,
								})
							);
					}
				}

				if (currentState === 'hover') {
					switch (featureId) {
						case 'publisherFontColor':
							return mergeObject(
								nextState,
								elementHoverFontColorToWPCompatibility({
									element: 'link',
									newValue,
									ref,
								})
							);
					}
				}
			}

			return nextState;
		}
	);
};

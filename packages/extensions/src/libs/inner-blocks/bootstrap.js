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
import type { BlockDetail } from '../block-states/types';
import {
	elementNormalFontColorFromWPCompatibility,
	elementHoverFontColorFromWPCompatibility,
	elementNormalFontColorToWPCompatibility,
	elementHoverFontColorToWPCompatibility,
} from './compatibility/element-font-color';
import {
	elementNormalBackgroundColorFromWPCompatibility,
	elementNormalBackgroundColorToWPCompatibility,
} from './compatibility/element-bg-color';

export const bootstrap = (): void => {
	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.sizeExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const {
				isNormalState,
				isBaseBreakpoint,
				isMasterBlock,
				innerBlocks,
			} = blockDetail;

			if (!isNormalState || !isBaseBreakpoint || !isMasterBlock) {
				return attributes;
			}

			if (attributes?.style?.elements === undefined) {
				return attributes;
			}

			Object.keys(innerBlocks).forEach((element) => {
				if (
					!attributes?.style?.elements[element] ||
					innerBlocks[element]?.innerBlockSettings
						?.dataCompatibility === undefined ||
					innerBlocks[element]?.innerBlockSettings?.dataCompatibility
						?.length === 0
				) {
					return;
				}

				//
				// Normal font color
				//
				if (
					innerBlocks[
						element
					]?.innerBlockSettings?.dataCompatibility.includes(
						'font-color'
					)
				) {
					if (
						!attributes?.publisherInnerBlocks?.link?.attributes
							?.publisherFontColor
					) {
						const newAttributes =
							elementNormalFontColorFromWPCompatibility({
								element,
								attributes,
							});

						if (newAttributes) {
							attributes = mergeObject(attributes, newAttributes);
						}
					}
				}

				//
				// Hover font color
				//
				if (
					innerBlocks[
						element
					]?.innerBlockSettings?.dataCompatibility.includes(
						'font-color-hover'
					)
				) {
					if (
						!attributes?.publisherInnerBlocks?.link?.attributes
							?.publisherBlockStates?.breakpoints?.laptop
							?.attributes?.publisherFontColor
					) {
						const newAttributes =
							elementHoverFontColorFromWPCompatibility({
								element,
								attributes,
							});

						if (newAttributes) {
							attributes = mergeObject(attributes, newAttributes);
						}
					}
				}

				//
				// Normal background
				//
				if (
					innerBlocks[
						element
					]?.innerBlockSettings?.dataCompatibility.includes(
						'background-color'
					)
				) {
					if (
						!attributes.publisherInnerBlocks[element] ||
						!attributes.publisherInnerBlocks[element]?.attributes
							?.publisherBackgroundColor
					) {
						const newAttributes =
							elementNormalBackgroundColorFromWPCompatibility({
								element,
								attributes,
							});
						if (newAttributes) {
							attributes = mergeObject(attributes, newAttributes);
						}
					}
				}
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
			const {
				isBaseBreakpoint,
				isMasterBlock,
				currentState,
				currentBlock,
				innerBlocks,
			} = blockDetail;

			if (!isBaseBreakpoint || isMasterBlock) {
				return nextState;
			}

			if (
				innerBlocks[currentBlock] === undefined ||
				innerBlocks[currentBlock]?.innerBlockSettings
					?.dataCompatibility === undefined ||
				innerBlocks[currentBlock]?.innerBlockSettings?.dataCompatibility
					?.length === 0
			) {
				return nextState;
			}

			//
			// Normal font color
			//
			if (
				currentState === 'normal' &&
				featureId === 'publisherFontColor' &&
				innerBlocks[
					currentBlock
				]?.innerBlockSettings?.dataCompatibility.includes('font-color')
			) {
				return mergeObject(
					nextState,
					elementNormalFontColorToWPCompatibility({
						element: currentBlock,
						newValue,
						ref,
					})
				);
			}

			//
			// Hover font color
			//
			if (
				currentState === 'hover' &&
				featureId === 'publisherFontColor' &&
				innerBlocks[
					currentBlock
				]?.innerBlockSettings?.dataCompatibility.includes(
					'font-color-hover'
				)
			) {
				return mergeObject(
					nextState,
					elementHoverFontColorToWPCompatibility({
						element: currentBlock,
						newValue,
						ref,
					})
				);
			}

			//
			// Normal background
			//
			if (
				currentState === 'normal' &&
				featureId === 'publisherBackgroundColor' &&
				innerBlocks[
					currentBlock
				]?.innerBlockSettings?.dataCompatibility.includes(
					'background-color'
				)
			) {
				return mergeObject(
					nextState,
					elementNormalBackgroundColorToWPCompatibility({
						element: currentBlock,
						newValue,
						ref,
					})
				);
			}

			return nextState;
		}
	);
};

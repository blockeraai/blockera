// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import type { ControlContextRef } from '@blockera/controls/js/context/types';
import { mergeObject } from '@blockera/utils';

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
import {
	elementNormalBackgroundFromWPCompatibility,
	elementNormalBackgroundToWPCompatibility,
} from './compatibility/element-bg';

export const bootstrap = (): void => {
	addFilter(
		'blockeraCore.blockEdit.attributes',
		'blockeraCore.blockEdit.sizeExtension.bootstrap',
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
						!attributes?.blockeraInnerBlocks?.link?.attributes
							?.blockeraFontColor
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
						!attributes?.blockeraInnerBlocks?.link?.attributes
							?.blockeraBlockStates?.breakpoints?.laptop
							?.attributes?.blockeraFontColor
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
				let bgAttributes;

				//
				// Background Color
				//
				if (
					innerBlocks[
						element
					]?.innerBlockSettings?.dataCompatibility.includes(
						'background-color'
					)
				) {
					if (
						!attributes.blockeraInnerBlocks[element] ||
						!attributes.blockeraInnerBlocks[element]?.attributes
							?.blockeraBackgroundColor
					) {
						bgAttributes =
							elementNormalBackgroundColorFromWPCompatibility({
								element,
								attributes,
							});

						if (bgAttributes) {
							attributes = mergeObject(attributes, bgAttributes);
						}
					}
				}

				//
				// Background Gradient
				//
				if (
					!bgAttributes &&
					innerBlocks[
						element
					]?.innerBlockSettings?.dataCompatibility.includes(
						'background-image'
					)
				) {
					if (
						!attributes.blockeraInnerBlocks[element] ||
						!attributes.blockeraInnerBlocks[element]?.attributes
							?.blockeraBackground
					) {
						bgAttributes =
							elementNormalBackgroundFromWPCompatibility({
								element,
								attributes,
							});

						if (bgAttributes) {
							attributes = mergeObject(attributes, bgAttributes);
						}
					}
				}
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
				featureId === 'blockeraFontColor' &&
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
				featureId === 'blockeraFontColor' &&
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
			// Normal background color
			//
			if (
				currentState === 'normal' &&
				featureId === 'blockeraBackgroundColor' &&
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
						getAttributes,
					})
				);
			}
			//
			// Normal background image
			//
			else if (
				currentState === 'normal' &&
				featureId === 'blockeraBackground' &&
				innerBlocks[
					currentBlock
				]?.innerBlockSettings?.dataCompatibility.includes(
					'background-image'
				)
			) {
				const attrs = getAttributes();

				// Item has BG color
				if (
					attrs.blockeraInnerBlocks[currentBlock] !== undefined &&
					attrs.blockeraInnerBlocks[currentBlock]?.attributes
						?.blockeraBackgroundColor
				) {
					return nextState;
				}

				return mergeObject(
					nextState,
					elementNormalBackgroundToWPCompatibility({
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

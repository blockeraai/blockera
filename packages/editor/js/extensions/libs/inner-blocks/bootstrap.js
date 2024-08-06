// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject, isUndefined } from '@blockera/utils';
import type { ControlContextRefCurrent } from '@blockera/controls';

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
import { getBaseBreakpoint } from '../../../canvas-editor';
import { isBlockNotOriginalState, isResetRef } from '../utils';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.sizeExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { innerBlocks } = blockDetail;

			if (isBlockNotOriginalState(blockDetail)) {
				return attributes;
			}

			if (
				isUndefined(attributes?.style?.elements) ||
				isUndefined(innerBlocks)
			) {
				return attributes;
			}

			Object.keys(innerBlocks).forEach((innerBlock) => {
				const dataCompatibilityElement =
					innerBlocks[innerBlock]?.settings
						?.dataCompatibilityElement || innerBlock;

				if (
					!attributes?.style?.elements[dataCompatibilityElement] ||
					isUndefined(
						innerBlocks[innerBlock]?.settings?.dataCompatibility
					) ||
					innerBlocks[innerBlock]?.settings?.dataCompatibility
						?.length === 0
				) {
					return;
				}

				//
				// Normal font color
				//
				if (
					innerBlocks[
						innerBlock
					]?.settings?.dataCompatibility.includes('font-color')
				) {
					if (
						!attributes?.blockeraInnerBlocks['elements/link']
							?.attributes?.blockeraFontColor
					) {
						const newAttributes =
							elementNormalFontColorFromWPCompatibility({
								innerBlock,
								attributes,
								dataCompatibilityElement,
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
						innerBlock
					]?.settings?.dataCompatibility.includes('font-color-hover')
				) {
					if (
						!attributes?.blockeraInnerBlocks['elements/link']
							?.attributes?.blockeraBlockStates?.hover
							?.breakpoints[getBaseBreakpoint()]?.attributes
							?.blockeraFontColor
					) {
						const newAttributes =
							elementHoverFontColorFromWPCompatibility({
								innerBlock,
								attributes,
								dataCompatibilityElement,
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
						innerBlock
					]?.settings?.dataCompatibility.includes('background-color')
				) {
					if (
						!attributes.blockeraInnerBlocks[innerBlock] ||
						!attributes.blockeraInnerBlocks[innerBlock]?.attributes
							?.blockeraBackgroundColor
					) {
						bgAttributes =
							elementNormalBackgroundColorFromWPCompatibility({
								innerBlock,
								attributes,
								dataCompatibilityElement,
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
						innerBlock
					]?.settings?.dataCompatibility.includes('background-image')
				) {
					if (
						!attributes.blockeraInnerBlocks[innerBlock] ||
						!attributes.blockeraInnerBlocks[innerBlock]?.attributes
							?.blockeraBackground
					) {
						bgAttributes =
							elementNormalBackgroundFromWPCompatibility({
								innerBlock,
								attributes,
								dataCompatibilityElement,
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
			const {
				isBaseBreakpoint,
				isMasterBlock,
				currentState,
				currentBlock,
				innerBlocks,
				isMasterNormalState,
			} = blockDetail;

			if (
				(!isBaseBreakpoint || isMasterBlock || !isMasterNormalState) &&
				!isResetRef(ref)
			) {
				return nextState;
			}

			if (
				isUndefined(innerBlocks[currentBlock]) ||
				isUndefined(
					innerBlocks[currentBlock]?.settings?.dataCompatibility
				) ||
				innerBlocks[currentBlock]?.settings?.dataCompatibility
					?.length === 0
			) {
				return nextState;
			}

			const element =
				innerBlocks[currentBlock]?.settings?.dataCompatibilityElement ||
				currentBlock;

			//
			// Normal font color
			//
			if (
				currentState === 'normal' &&
				featureId === 'blockeraFontColor' &&
				innerBlocks[currentBlock]?.settings?.dataCompatibility.includes(
					'font-color'
				)
			) {
				return mergeObject(
					nextState,
					elementNormalFontColorToWPCompatibility({
						element,
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
				innerBlocks[currentBlock]?.settings?.dataCompatibility.includes(
					'font-color-hover'
				)
			) {
				return mergeObject(
					nextState,
					elementHoverFontColorToWPCompatibility({
						element,
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
				innerBlocks[currentBlock]?.settings?.dataCompatibility.includes(
					'background-color'
				)
			) {
				return mergeObject(
					nextState,
					elementNormalBackgroundColorToWPCompatibility({
						element,
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
				innerBlocks[currentBlock]?.settings?.dataCompatibility.includes(
					'background-image'
				)
			) {
				const attrs = getAttributes();

				// Item has BG color
				if (
					!isUndefined(attrs.blockeraInnerBlocks[currentBlock]) &&
					attrs.blockeraInnerBlocks[currentBlock]?.attributes
						?.blockeraBackgroundColor
				) {
					return nextState;
				}

				return mergeObject(
					nextState,
					elementNormalBackgroundToWPCompatibility({
						element,
						newValue,
						ref,
					})
				);
			}

			return nextState;
		}
	);
};

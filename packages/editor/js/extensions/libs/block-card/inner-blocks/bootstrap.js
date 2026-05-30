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
import {
	elementGenericFromWPCompatibility,
	elementGenericToWPCompatibility,
} from './compatibility/element-generic';
import { resolveInnerBlockCompatGateKey } from './compatibility/element-schema';
import {
	INNER_BLOCK_COMPAT_REGISTRY,
	SPECIAL_INNER_BLOCK_COMPAT_KEYS,
	getRegistryEntryForSetAttributes,
} from './compatibility/registry';
import { isResetRef, runInsideBlockInspector } from '../../utils';
import {
	getBlockeraInnerBlockItem,
	hasDataCompatibility,
	resolveDataCompatibilityElement,
} from './utils';
import {
	elementDataHasStyleData,
	getInnerBlockAttributesForState,
} from './compatibility/element-scope';

const getInnerBlockAttributes = (
	attributes: Object,
	innerBlock: string
): Object =>
	getBlockeraInnerBlockItem(attributes, innerBlock)?.attributes || {};

const hasElementStyles = (
	attributes: Object,
	dataCompatibilityElement: string,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style'
): boolean => {
	const useStyle = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	);

	const elementData = useStyle
		? attributes?.style?.elements?.[dataCompatibilityElement]
		: attributes?.elements?.[dataCompatibilityElement];

	return elementDataHasStyleData(elementData);
};

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.innerBlocksExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const {
				blockId,
				innerBlocks,
				insideBlockInspector,
				editorSelectedBlockEvent,
			} = blockDetail;

			if (
				(isUndefined(attributes?.style?.elements) &&
					isUndefined(attributes?.elements)) ||
				isUndefined(innerBlocks)
			) {
				return attributes;
			}

			Object.keys(innerBlocks).forEach((innerBlock) => {
				const dataCompatibilityElement =
					resolveDataCompatibilityElement(innerBlocks, innerBlock);

				const dataCompatibility =
					innerBlocks[innerBlock]?.settings?.dataCompatibility;

				if (
					!hasElementStyles(
						attributes,
						dataCompatibilityElement,
						insideBlockInspector,
						editorSelectedBlockEvent
					) ||
					isUndefined(dataCompatibility) ||
					dataCompatibility.length === 0
				) {
					return;
				}

				const innerBlockAttributes = getInnerBlockAttributes(
					attributes,
					innerBlock
				);

				//
				// Normal font color
				//
				if (
					hasDataCompatibility(innerBlocks, innerBlock, 'font-color')
				) {
					if (!innerBlockAttributes?.blockeraFontColor) {
						const newAttributes =
							elementNormalFontColorFromWPCompatibility({
								innerBlock,
								attributes,
								dataCompatibilityElement,
								insideBlockInspector,
								editorSelectedBlockEvent,
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
					hasDataCompatibility(
						innerBlocks,
						innerBlock,
						'font-color-hover'
					)
				) {
					const hoverAttributes = getInnerBlockAttributesForState(
						innerBlockAttributes,
						'hover'
					);

					if (!hoverAttributes?.blockeraFontColor) {
						const newAttributes =
							elementHoverFontColorFromWPCompatibility({
								innerBlock,
								attributes,
								dataCompatibilityElement,
								insideBlockInspector,
								editorSelectedBlockEvent,
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
					hasDataCompatibility(
						innerBlocks,
						innerBlock,
						'background-color'
					)
				) {
					if (!innerBlockAttributes?.blockeraBackgroundColor) {
						bgAttributes =
							elementNormalBackgroundColorFromWPCompatibility({
								innerBlock,
								attributes,
								dataCompatibilityElement,
								insideBlockInspector,
								editorSelectedBlockEvent,
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
					hasDataCompatibility(
						innerBlocks,
						innerBlock,
						'background-image'
					)
				) {
					if (!innerBlockAttributes?.blockeraBackground) {
						bgAttributes =
							elementNormalBackgroundFromWPCompatibility({
								innerBlock,
								attributes,
								dataCompatibilityElement,
								insideBlockInspector,
								editorSelectedBlockEvent,
							});

						if (bgAttributes) {
							attributes = mergeObject(attributes, bgAttributes);
						}
					}
				}

				//
				// Other extension mirrors (typography, border, spacing, shadow, …)
				//
				INNER_BLOCK_COMPAT_REGISTRY.forEach((entry) => {
					if (
						SPECIAL_INNER_BLOCK_COMPAT_KEYS.includes(entry.key) ||
						!dataCompatibility.includes(
							resolveInnerBlockCompatGateKey(entry.key)
						)
					) {
						return;
					}

					const newAttributes = elementGenericFromWPCompatibility({
						innerBlock,
						attributes,
						dataCompatibilityElement,
						insideBlockInspector,
						editorSelectedBlockEvent,
						entry,
						blockId,
					});

					if (newAttributes) {
						attributes = mergeObject(attributes, newAttributes);
					}
				});
			});

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.innerBlocksExtension.bootstrap.setAttributes',
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
				blockId,
				isBaseBreakpoint,
				isMasterBlock,
				currentState,
				currentBlock,
				innerBlocks,
				isMasterNormalState,
				insideBlockInspector,
				editorSelectedBlockEvent,
			} = blockDetail;

			if (
				(!isBaseBreakpoint || isMasterBlock || !isMasterNormalState) &&
				!isResetRef(ref)
			) {
				return nextState;
			}

			if (
				isUndefined(innerBlocks) ||
				isUndefined(innerBlocks[currentBlock]) ||
				isUndefined(
					innerBlocks[currentBlock]?.settings?.dataCompatibility
				) ||
				innerBlocks[currentBlock]?.settings?.dataCompatibility
					?.length === 0
			) {
				return nextState;
			}

			const dataCompatibilityElement = resolveDataCompatibilityElement(
				innerBlocks,
				currentBlock
			);

			const dataCompatibility =
				innerBlocks[currentBlock]?.settings?.dataCompatibility;

			//
			// Normal font color
			//
			if (
				currentState === 'normal' &&
				featureId === 'blockeraFontColor' &&
				hasDataCompatibility(innerBlocks, currentBlock, 'font-color')
			) {
				return mergeObject(
					nextState,
					elementNormalFontColorToWPCompatibility({
						element: dataCompatibilityElement,
						newValue,
						ref,
						insideBlockInspector,
						editorSelectedBlockEvent,
					})
				);
			}

			//
			// Hover font color
			//
			if (
				currentState === 'hover' &&
				featureId === 'blockeraFontColor' &&
				hasDataCompatibility(
					innerBlocks,
					currentBlock,
					'font-color-hover'
				)
			) {
				return mergeObject(
					nextState,
					elementHoverFontColorToWPCompatibility({
						element: dataCompatibilityElement,
						newValue,
						ref,
						insideBlockInspector,
						editorSelectedBlockEvent,
					})
				);
			}

			//
			// Normal background color
			//
			if (
				currentState === 'normal' &&
				featureId === 'blockeraBackgroundColor' &&
				hasDataCompatibility(
					innerBlocks,
					currentBlock,
					'background-color'
				)
			) {
				return mergeObject(
					nextState,
					elementNormalBackgroundColorToWPCompatibility({
						element: dataCompatibilityElement,
						newValue,
						ref,
						getAttributes,
						innerBlock: currentBlock,
						insideBlockInspector,
						editorSelectedBlockEvent,
					})
				);
			}

			//
			// Normal background image
			//
			if (
				currentState === 'normal' &&
				featureId === 'blockeraBackground' &&
				hasDataCompatibility(
					innerBlocks,
					currentBlock,
					'background-image'
				)
			) {
				const attrs = getAttributes();
				const innerBlockAttributes = getInnerBlockAttributes(
					attrs,
					currentBlock
				);

				if (innerBlockAttributes?.blockeraBackgroundColor) {
					return nextState;
				}

				return mergeObject(
					nextState,
					elementNormalBackgroundToWPCompatibility({
						element: dataCompatibilityElement,
						newValue,
						ref,
						insideBlockInspector,
						editorSelectedBlockEvent,
					})
				);
			}

			//
			// Registry-backed extension mirrors
			//
			const registryEntry = getRegistryEntryForSetAttributes(
				featureId,
				currentState,
				dataCompatibility,
				INNER_BLOCK_COMPAT_REGISTRY
			);

			if (registryEntry) {
				return mergeObject(
					nextState,
					elementGenericToWPCompatibility({
						dataCompatibilityElement,
						newValue,
						ref,
						insideBlockInspector,
						editorSelectedBlockEvent,
						entry: registryEntry,
						blockId,
					})
				);
			}

			return nextState;
		}
	);
};

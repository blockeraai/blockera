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
import { elementsSupportedBlocks } from './compatibility/elements';

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

			Object.keys(elementsSupportedBlocks).forEach((element) => {
				switch (element) {
					//
					// Link element
					//
					case 'link':
						if (
							!attributes?.style?.elements[element] ||
							!elementsSupportedBlocks[element].includes(blockId)
						) {
							return; // Skip this element
						}

						//
						// Normal font color
						//
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
								attributes = mergeObject(
									attributes,
									newAttributes
								);
							}
						}

						//
						// Hover font color
						//
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
								attributes = mergeObject(
									attributes,
									newAttributes
								);
							}
						}
						break;
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
				blockId,
				isBaseBreakpoint,
				isMasterBlock,
				currentState,
				currentBlock,
			} = blockDetail;

			if (!isBaseBreakpoint || isMasterBlock) {
				return nextState;
			}

			switch (currentBlock) {
				//
				// Link element
				//
				case 'link':
					if (
						!elementsSupportedBlocks[currentBlock].includes(blockId)
					) {
						return nextState;
					}

					//
					// Normal state
					//
					if (currentState === 'normal') {
						switch (featureId) {
							//
							// Font color
							//
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

					//
					// Hover state
					//
					else if (currentState === 'hover') {
						switch (featureId) {
							//
							// Font color
							//
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
					break;
			}

			return nextState;
		}
	);
};

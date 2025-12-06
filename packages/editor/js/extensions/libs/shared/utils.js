// @flow

/**
 * External dependencies
 */
import { getBlockType } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { getEditorDocumentElement } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { prepareBlockCssSelector } from '../../../style-engine/get-compatible-block-css-selector';

/**
 * Gets the parent flex block information.
 *
 * @param {Object} block - The block object.
 * @param {string} block.clientId - The client ID of the block.
 * @param {string} block.blockName - The name of the block.
 * @param {string} block.currentBlock - The current block.
 * @param {string} block.currentState - The current state.
 * @param {string} block.currentInnerBlockState - The current inner block state.
 * @return {Object} The parent flex block information.
 * @property {boolean} isParentFlexBlock - True if the parent block is a flex block, false otherwise.
 * @property {string} parentFlexDirection - The direction of the parent flex block.
 */
export function getParentFlexBlockInfo(block: {
	clientId: string,
	blockName: string,
	currentBlock: string,
	currentState: string,
	currentInnerBlockState: string,
}): {
	isParentFlexBlock: boolean,
	parentFlexDirection: 'row' | 'column' | '',
} {
	let parentFlexBlock: boolean = false;
	let parentFlexBlockDirection: 'row' | 'column' | '' = '';

	const currentBlockElement: ?HTMLElement =
		getEditorDocumentElement()?.querySelector(`#block-${block.clientId}`);

	function isPseudoElementState(state: string): boolean {
		return ['before', 'after', 'marker', 'placeholder'].includes(state);
	}

	if (currentBlockElement) {
		let parentElement;

		if (block.currentBlock === 'master') {
			// If the current state is a pseudo element state, use the current block element as parent element.
			if (isPseudoElementState(block.currentState)) {
				parentElement = currentBlockElement;
			} else {
				parentElement = currentBlockElement?.parentElement;
			}

			// If the parent element is a social link, use the parent element as parent element.
			// This is a workaround to get the parent element of the special blocks like social link.
			if (
				parentElement &&
				parentElement.classList.contains('wp-social-link')
			) {
				parentElement = parentElement.parentElement;
			}
		} else if (block.currentBlock !== 'master') {
			const currentBlockType = getBlockType(block.blockName);

			// Get the selector for the current inner block
			const currentInnerBlockSelector = prepareBlockCssSelector({
				query: `blockera/${block.currentBlock}`,
				selectors: currentBlockType.selectors,
				supports: currentBlockType.supports,
				blockName: block.blockName,
			});

			// Get the parent element of the current inner block.
			// It can be different than the master block element.
			if (currentInnerBlockSelector) {
				try {
					// If the current inner block state is a pseudo element state, use the current inner block element as parent element.
					if (isPseudoElementState(block.currentInnerBlockState)) {
						parentElement = currentBlockElement?.querySelector(
							currentInnerBlockSelector
						);
					} else {
						parentElement = currentBlockElement?.querySelector(
							currentInnerBlockSelector
						)?.parentElement;
					}
				} catch (error) {
					// Invalid selector, will fall back to master block element
					parentElement = null;
				}
			}

			// If the parent element is not found, use the master block as parent element.
			if (!parentElement) {
				parentElement = currentBlockElement;
			}
		}

		if (
			parentElement &&
			!parentElement.classList.contains('is-root-container')
		) {
			const parentStyle = window.getComputedStyle(parentElement, null);
			const displayValue = parentStyle.getPropertyValue('display');

			parentFlexBlock =
				displayValue === 'flex' || displayValue === 'inline-flex';

			if (parentFlexBlock) {
				const parentDirection =
					parentStyle.getPropertyValue('flex-direction');

				parentFlexBlockDirection = ['row', 'column'].includes(
					parentDirection
				)
					? parentDirection
					: 'row';
			}
		}
	}

	return {
		isParentFlexBlock: parentFlexBlock,
		parentFlexDirection: parentFlexBlockDirection,
	};
}

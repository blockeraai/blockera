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

export function getParentFlexBlockInfo(block: {
	clientId: string,
	blockName: string,
	currentBlock: string,
}): {
	isParentFlexBlock: boolean,
	parentFlexDirection: 'row' | 'column' | '',
} {
	let parentFlexBlock: boolean = false;
	let parentFlexBlockDirection: 'row' | 'column' | '' = '';

	const currentBlockElement: ?HTMLElement =
		getEditorDocumentElement()?.querySelector(`#block-${block.clientId}`);

	if (currentBlockElement) {
		let parentElement;

		if (block.currentBlock === 'master') {
			parentElement = currentBlockElement?.parentElement;
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
				parentElement = currentBlockElement?.querySelector(
					currentInnerBlockSelector
				)?.parentElement;
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

			parentFlexBlock =
				parentStyle.getPropertyValue('display') === 'flex';

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

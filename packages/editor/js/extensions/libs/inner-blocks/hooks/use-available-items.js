// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isString, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { isBlock, isElement } from '../helpers';
import type {
	InnerBlocks,
	AvailableItems,
	InnerBlockType,
	InnerBlockModel,
} from '../types';

export const useAvailableItems = ({
	clientId,
	getBlockInners,
	reservedInnerBlocks,
	memoizedInnerBlocks,
	setBlockClientInners,
}: AvailableItems): { blocks: InnerBlocks, elements: InnerBlocks } => {
	// External selectors. to access registered block types on WordPress blocks store api.
	const { getBlockType } = select('core/blocks');
	const { getAllowedBlocks } = select('core/block-editor');
	const allowedBlockTypes = getAllowedBlocks(clientId);

	return useMemo(() => {
		const forces: Array<InnerBlockModel> = [];
		const blocks: Array<InnerBlockModel> = [];
		const elements: Array<InnerBlockModel> = [];

		Object.keys(reservedInnerBlocks).forEach(
			(innerBlockType: InnerBlockType | string) => {
				const innerBlock: InnerBlockModel =
					reservedInnerBlocks[innerBlockType];

				// Skip customized inner blocks.
				if (memoizedInnerBlocks[innerBlockType]) {
					return;
				}

				if (innerBlock?.settings?.force) {
					forces.push(innerBlock);

					return;
				}

				if (isElement(innerBlock)) {
					elements.push(innerBlock);
				} else if (isBlock(innerBlock)) {
					blocks.push(innerBlock);
				}
			}
		);

		const appendBlocks = (stack: Array<any>) => {
			stack.forEach((innerBlock: any) => {
				const blockType = getBlockType(
					isString(innerBlock) ? innerBlock : innerBlock.name
				);

				const isRegistered = (block: InnerBlockModel): boolean =>
					block.name === blockType?.name;

				// Skip customized or registered inner blocks.
				if (
					!memoizedInnerBlocks[blockType?.name] &&
					!forces.find(isRegistered) &&
					!blocks.find(isRegistered)
				) {
					blocks.push({
						...blockType,
						icon: blockType?.icon?.src ||
							reservedInnerBlocks[blockType.name]?.icon || <></>,
						label:
							blockType?.title ||
							reservedInnerBlocks[blockType.name]?.label,
					});
				}
			});
		};

		// Appending allowed block types of WordPress selected block ...
		appendBlocks(allowedBlockTypes);

		// Appending forces into repeater state.
		if (forces.length) {
			// Previous inner blocks stack.
			const inners = getBlockInners(clientId);

			setBlockClientInners({
				clientId,
				inners: mergeObject(
					forces.reduce(
						(accumulator, innerBlock) => ({
							...accumulator,
							[innerBlock?.name]: {
								...innerBlock,
								// Item force is not deletable!
								deletable: false,
							},
						}),
						{}
					),
					inners
				),
			});
		}

		return { elements, blocks };
		// eslint-disable-next-line
	}, [reservedInnerBlocks, memoizedInnerBlocks]);
};

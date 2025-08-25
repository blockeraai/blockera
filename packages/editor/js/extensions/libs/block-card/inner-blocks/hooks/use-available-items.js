// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isString, mergeObject, getSortedObject } from '@blockera/utils';

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
	maxItems,
	getBlockInners,
	reservedInnerBlocks,
	memoizedInnerBlocks,
	setBlockClientInners,
}: AvailableItems): { blocks: InnerBlocks, elements: InnerBlocks } => {
	// External selectors. to access registered block types on WordPress blocks store api.
	const { getBlockType } = select('core/blocks');
	const { getAllowedBlocks, getSelectedBlock } = select('core/block-editor');
	const allowedBlockTypes = getAllowedBlocks(clientId);
	const { innerBlocks, attributes } = getSelectedBlock() || {
		innerBlocks: [],
		attributes: {},
	};

	return useMemo(() => {
		const forces: Array<InnerBlockModel> = [];
		const blocks: Array<InnerBlockModel> = [];
		const elements: Array<InnerBlockModel> = [];

		Object.keys(reservedInnerBlocks).forEach(
			(innerBlockType: InnerBlockType | string) => {
				const innerBlock: InnerBlockModel =
					reservedInnerBlocks[innerBlockType];

				if (innerBlock?.settings?.force) {
					forces.push(innerBlock);
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

		const { forcesItems, customizedInnerBlocks } = maxItems
			? modifyItemsPriority(innerBlocks, forces, attributes)
			: {
					forcesItems: forces,
					customizedInnerBlocks: innerBlocks,
			  };

		// Appending forces into repeater state.
		if (forces.length) {
			// Previous inner blocks stack.
			const inners = getBlockInners(clientId);

			setBlockClientInners({
				clientId,
				inners: calculateInners({
					inners,
					maxItems,
					forcesItems,
					customizedInnerBlocks,
				}),
			});
		}

		return { elements, blocks };
		// eslint-disable-next-line
	}, [reservedInnerBlocks, memoizedInnerBlocks]);
};

export const modifyItemsPriority = (
	appendedItems: Array<InnerBlockModel>,
	forcesItems: Array<InnerBlockModel>,
	attributes: Object
): {
	forcesItems: Array<InnerBlockModel>,
	customizedInnerBlocks: Array<InnerBlockModel>,
} => {
	const customizedInnerBlocks: Array<InnerBlockModel> = [];
	const processedItems: Set<string> = new Set();

	const forcesItemsProcessor = (blockType: InnerBlockModel) => {
		for (let index = 0; index < forcesItems.length; index++) {
			const elementType = forcesItems[index];
			const priority = elementType.settings?.priority || 10;

			if (
				Object.keys(
					(
						attributes?.blockeraInnerBlocks?.value[
							elementType.name
						] || {}
					)?.attributes || {}
				).length
			) {
				let newPriority = priority - 1 === -1 ? 0 : priority - 1;

				if (elementType.name === blockType.name && newPriority > 0) {
					newPriority -= 1;
				}

				const foundedItemIndex = customizedInnerBlocks.findIndex(
					(block: InnerBlockModel) => block.name === blockType?.name
				);
				const hasElement = foundedItemIndex !== -1;

				if (hasElement) {
					const foundedItem = customizedInnerBlocks[foundedItemIndex];

					if (foundedItem.settings.priority - 1 === -1) {
						foundedItem.settings.priority = 0;
					} else {
						foundedItem.settings.priority -= 1;
					}

					customizedInnerBlocks[foundedItemIndex] = foundedItem;
				} else {
					if (!processedItems.has(elementType.name)) {
						customizedInnerBlocks.push({
							...elementType,
							settings: {
								...elementType.settings,
								priority: newPriority,
							},
						});
					}

					processedItems.add(elementType.name);
				}
			}

			if (elementType.name === blockType.name) {
				forcesItems[index] = {
					...elementType,
					settings: {
						...elementType.settings,
						priority: priority - 1 === -1 ? 0 : priority - 1,
					},
				};
			}
		}
	};

	for (const blockType of appendedItems) {
		forcesItemsProcessor(blockType);

		for (const innerBlockType of blockType.innerBlocks) {
			if ('core/buttons' === innerBlockType.name) {
				for (const buttonInnerBlockType of innerBlockType.innerBlocks) {
					forcesItemsProcessor(buttonInnerBlockType);
				}
			}
			forcesItemsProcessor(innerBlockType);
		}
	}

	return {
		forcesItems,
		customizedInnerBlocks,
	};
};

const calculateInners = ({
	inners,
	maxItems,
	forcesItems,
	customizedInnerBlocks,
}: {
	inners: InnerBlocks,
	maxItems?: number | void,
	forcesItems: Array<InnerBlockModel>,
	customizedInnerBlocks: Array<InnerBlockModel>,
}) => {
	const normalizedInners = (
		items: Array<InnerBlockModel>
	): { [key: string]: InnerBlockModel } => {
		return getSortedObject(
			items.reduce(
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
			'settings',
			10
		);
	};
	const limitedByMaxItems = (
		items: {
			[key: string]: InnerBlockModel,
		},
		maxItems: number,
		registeredItems?: Array<InnerBlockModel>
	): { [key: string]: InnerBlockModel } => {
		const limitedForces: { [key: string]: InnerBlockModel } = {};

		for (const key in items) {
			const force = items[key];

			if (
				registeredItems &&
				registeredItems?.find((item) => item.name === force.name)
			) {
				continue;
			}

			if (Object.keys(limitedForces).length >= maxItems) {
				break;
			}

			limitedForces[force.name] = force;
		}

		return limitedForces;
	};

	if (maxItems) {
		if (customizedInnerBlocks.length === maxItems) {
			return mergeObject(normalizedInners(customizedInnerBlocks), inners);
		}

		if (customizedInnerBlocks.length < maxItems) {
			const limitedForcesInnerBlocks = limitedByMaxItems(
				normalizedInners(forcesItems),
				maxItems - customizedInnerBlocks.length,
				customizedInnerBlocks
			);

			return mergeObject(
				{
					...normalizedInners(customizedInnerBlocks),
					...limitedForcesInnerBlocks,
				},
				inners
			);
		}

		if (!customizedInnerBlocks.length) {
			return mergeObject(
				limitedByMaxItems(normalizedInners(forcesItems), maxItems),
				inners
			);
		}

		return mergeObject(normalizedInners(customizedInnerBlocks), inners);
	}

	return mergeObject(normalizedInners(forcesItems), inners);
};

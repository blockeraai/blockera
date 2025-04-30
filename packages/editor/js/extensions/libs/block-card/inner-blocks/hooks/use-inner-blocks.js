// @flow

/**
 * External dependencies
 */
import { useSelect, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import type { InnerBlocks, InnerBlockType } from '../types';
import { generateExtensionId } from '../../../utils';
import { isInnerBlock } from '../../../../components';
import { useMemoizedInnerBlocks, useAvailableItems } from './';

export const useInnerBlocks = ({
	block,
	values,
	innerBlocks,
	currentBlock,
}: {
	block: Object,
	values: Object,
	onChange: Function,
	innerBlocks: InnerBlocks,
	currentBlock: 'master' | InnerBlockType | string,
}): Object => {
	// Internal selectors. to access current selected block and inner blocks stack of Blockera editor/extensions store api.
	const { currentBlock: currentBlockType = currentBlock, getBlockInners } =
		useSelect((select) => {
			const { getBlockInners, getExtensionCurrentBlock } = select(
				'blockera/extensions'
			);

			return {
				getBlockInners,
				currentBlock: getExtensionCurrentBlock(),
			};
		});

	// Internal dispatchers. to use of "setCurrentBlock" and "setBlockClientInners" dispatchers of Blockera editor/extensions store api.
	const {
		changeExtensionCurrentBlock: setCurrentBlock,
		setBlockClientInners,
	} = dispatch('blockera/extensions') || {};

	// Calculation: to prepare standard values for "blockeraInnerBlocks" block attribute with set initial value for repeater by "setBlockClientInners" dispatcher.
	const memoizedInnerBlocks = useMemoizedInnerBlocks({
		getBlockInners,
		setBlockClientInners,
		controlValue: values,
		clientId: block?.clientId,
		reservedInnerBlocks: innerBlocks,
	});

	// Calculation: to categorized in two category (elements and blocks) from available inner blocks on current WordPress selected block.
	const { elements, blocks } = useAvailableItems({
		getBlockInners,
		memoizedInnerBlocks,
		setBlockClientInners,
		clientId: block?.clientId,
		reservedInnerBlocks: innerBlocks,
	});

	// Merging all categories, as available blocks.
	const availableBlocks = [...elements, ...blocks];

	// Get repeater value from internal Blockera store api.
	const value = getBlockInners(block.clientId);

	for (const item in value) {
		value[item] = {
			...value[item],
			isSelected: currentBlockType === item,
			selectable: true,
		};
	}

	// cache length to not calculate it multiple times
	const innerBlocksLength = Object.keys(innerBlocks).length;

	if (
		!innerBlocksLength ||
		(!availableBlocks.length && !Object.keys(value).length) ||
		isInnerBlock(currentBlock)
	) {
		return {};
	}

	// Assign control context provider value.
	const contextValue = {
		block,
		value,
		blockName: block.blockName,
		attribute: 'blockeraInnerBlocks',
		name: generateExtensionId(block, 'inner-blocks', false),
	};

	// Calculation: repeater maxItems property.
	const maxItems = innerBlocksLength;

	return {
		blocks,
		elements,
		maxItems,
		contextValue,
		getBlockInners,
		setCurrentBlock,
		availableBlocks,
		innerBlocksLength,
		setBlockClientInners,
	};
};

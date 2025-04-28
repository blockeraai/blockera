// @flow

/**
 * External dependencies
 */
import { useSelect, dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { generateExtensionId } from '../../utils';
import { useBlockSection, isInnerBlock } from '../../../components';
import { useAvailableItems, useMemoizedInnerBlocks } from './index';
import type { InnerBlocksProps, InnerBlocksProvidedProps } from '../types';

export const useInnerBlocks = ({
	values,
	block,
	// onChange,
	innerBlocks,
}: InnerBlocksProps): InnerBlocksProvidedProps => {
	const { onToggle } = useBlockSection('innerBlocksConfig');

	// Internal selectors. to access current selected block and inner blocks stack of Blockera editor/extensions store api.
	const { currentBlock = 'master', getBlockInners } = useSelect((select) => {
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
		clientId: block?.clientId || '',
		reservedInnerBlocks: innerBlocks || {},
	});

	// Calculation: to categorized in two category (elements and blocks) from available inner blocks on current WordPress selected block.
	const { elements, blocks } = useAvailableItems({
		getBlockInners,
		memoizedInnerBlocks,
		setBlockClientInners,
		clientId: block?.clientId || '',
		reservedInnerBlocks: innerBlocks || {},
	});

	// Merging all categories, as available blocks.
	const availableBlocks = [...elements, ...blocks];

	// Get repeater value from internal Blockera store api.
	const value = getBlockInners(block.clientId);

	// cache length to not calculate it multiple times
	const innerBlocksLength = Object.keys(innerBlocks).length;

	// Assign control context provider value.
	const contextValue = {
		block,
		value,
		blockName: block.blockName,
		attribute: 'blockeraInnerBlocks',
		name: generateExtensionId(block, 'inner-blocks', false),
	};

	if (
		!innerBlocksLength ||
		(!availableBlocks.length && !Object.keys(value).length) ||
		isInnerBlock(currentBlock)
	) {
		return {
			blocks,
			elements,
			onToggle,
			maxItems: 0,
			contextValue,
			getBlockInners,
			setCurrentBlock,
			availableBlocks,
			innerBlocksLength,
			setBlockClientInners,
			clientId: block?.clientId || '',
		};
	}

	// Calculation: repeater maxItems property.
	const maxItems = innerBlocksLength;

	return {
		blocks,
		elements,
		onToggle,
		maxItems,
		contextValue,
		getBlockInners,
		setCurrentBlock,
		availableBlocks,
		innerBlocksLength,
		setBlockClientInners,
		clientId: block?.clientId || '',
	};
};

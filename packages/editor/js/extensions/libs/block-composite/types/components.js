// @flow

/**
 * Internal dependencies
 */
import type { TStates, StateTypes } from '../../block-states/types';
import type { InnerBlocks, InnerBlockType } from '../../inner-blocks/types';

export type MemoizedInnerBlocks = {
	clientId: string,
	setBlockClientInners: ({
		clientId: string,
		inners: InnerBlocks,
	}) => void,
	controlValue: InnerBlocks,
	reservedInnerBlocks: InnerBlocks,
	getBlockInners: (clientId: string) => InnerBlocks,
};

export type AvailableItemsProps = {
	states: { [key: TStates]: StateTypes },
	clientId: string,
	blocks: InnerBlocks,
	elements: InnerBlocks,
	setBlockState: (blockState: TStates) => void,
	setBlockClientInners: (args: Object) => void,
	setCurrentBlock: (block: InnerBlockType) => void,
	getBlockInners: (clientId: string) => InnerBlocks,
};

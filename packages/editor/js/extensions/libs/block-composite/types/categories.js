// @flow

/**
 * Internal dependencies
 */
import type { InnerBlocks } from '../../block-card/inner-blocks/types';
import type { TStates, StateTypes } from '../../block-card/block-states/types';

type StatesObject = {
	[key: TStates]: StateTypes,
};

export type TCategoriesProps = {
	states: StatesObject,
	clientId: string,
	blocks: InnerBlocks,
	elements: InnerBlocks,
	savedStates: StatesObject,
	getBlockStates: () => StatesObject,
	setBlockState: (states: StatesObject) => void,
	setBlockClientInners: (args: Object) => void,
	setCurrentBlock: (currentBlock: string) => void,
	getBlockInners: (clientId: string) => InnerBlocks,
};

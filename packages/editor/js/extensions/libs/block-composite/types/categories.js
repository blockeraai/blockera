// @flow

/**
 * Internal dependencies
 */
import type { InnerBlocks } from '../../inner-blocks/types';
import type { TStates, StateTypes } from '../../block-states/types';

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

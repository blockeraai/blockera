// @flow

/**
 * Internal dependencies
 */
import type { TStates, StateTypes } from '../../block-card/block-states/types';
import type {
	InnerBlocks,
	InnerBlockModel,
	InnerBlockType,
} from '../../block-card/inner-blocks/types';

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

export type TCategorizedItemsProps = {
	itemType?: string,
	items: Array<any> | Object,
	title: any,
	clientId: string,
	category: string,
	limited?: boolean,
	states: StatesObject,
	savedStates: StatesObject,
	customSelector?: StateTypes,
	setBlockClientInners: (args: Object) => void,
	setBlockState: (states: StatesObject) => void,
	setCurrentBlock: (currentBlock: string) => void,
	getBlockInners: (clientId: string) => InnerBlocks,
	getBlockType: (blockType: InnerBlockType) => InnerBlockModel,
};

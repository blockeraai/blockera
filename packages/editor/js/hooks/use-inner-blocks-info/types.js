// @flow

/**
 * Internal dependencies
 */
import type {
	InnerBlocks,
	InnerBlockType,
	InnerBlockModel,
} from '../../extensions/libs/inner-blocks/types';
import type {
	TBreakpoint,
	TStates,
} from '../../extensions/libs/block-states/types';

export type InnerBlocksInfoProps = {
	name: string,
	attributes: Object,
	additional: Object,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentBlock: 'master' | InnerBlockType,
};

export type InnerBlocksInfo = {
	currentInnerBlock: InnerBlockModel | null,
	blockeraInnerBlocks: InnerBlocks,
};

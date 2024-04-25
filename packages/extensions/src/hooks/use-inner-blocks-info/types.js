// @flow

/**
 * Internal dependencies
 */
import type {
	InnerBlocks,
	InnerBlockType,
	InnerBlockModel,
} from '../../libs/inner-blocks/types';
import type { TBreakpoint, TStates } from '../../libs/block-states/types';

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

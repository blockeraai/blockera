// @flow

/**
 * Internal dependencies
 */
import type {
	InnerBlocks,
	InnerBlockType,
	InnerBlockModel,
} from '../../extensions/libs/block-card/inner-blocks/types';
import type {
	TStates,
	TBreakpoint,
} from '../../extensions/libs/block-card/block-states/types';

export type CalculateCurrentAttributesProps = {
	attributes: Object,
	currentState: TStates,
	blockAttributes: Object,
	currentBreakpoint: TBreakpoint,
	blockeraInnerBlocks: InnerBlocks,
	currentInnerBlock: InnerBlockModel,
	currentBlock: string | InnerBlockType | 'master',
};

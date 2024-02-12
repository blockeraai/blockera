// @flow

/**
 * Internal dependencies
 */
import type {
	InnerBlocks,
	InnerBlockType,
	InnerBlockModel,
} from '../../libs/inner-blocks/types';
import type { TStates, TBreakpoint } from '../../libs/block-states/types';

export type CalculateCurrentAttributesProps = {
	attributes: Object,
	innerBlockId: number,
	currentState: TStates,
	isNormalState: () => boolean,
	currentBreakpoint: TBreakpoint,
	publisherInnerBlocks: InnerBlocks,
	currentInnerBlock: InnerBlockModel,
	currentBlock: 'master' | InnerBlockType,
};

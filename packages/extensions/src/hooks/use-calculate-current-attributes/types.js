// @flow

/**
 * Internal dependencies
 */
import type {
	InnerBlockModel,
	InnerBlockType,
} from '../../libs/inner-blocks/types';

export type CalculateCurrentAttributesProps = {
	attributes: Object,
	blockStateId: number,
	breakpointId: number,
	innerBlockId: number,
	isNormalState: () => boolean,
	currentInnerBlock: InnerBlockModel,
	currentBlock: 'master' | InnerBlockType,
	publisherInnerBlocks: Array<InnerBlockModel>,
};

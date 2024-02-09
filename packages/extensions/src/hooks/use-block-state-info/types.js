// @flow

/**
 * Internal dependencies
 */
import type {
	InnerBlockModel,
	InnerBlockType,
} from '../../libs/inner-blocks/types';

export type BlockStateInfo = {
	blockStateId: number,
	breakpointId: number,
	currentStateIndex: number,
};

export type BlockStateInfoProps = {
	attributes: Object,
	currentInnerBlock: InnerBlockModel,
	currentBlock: 'master' | InnerBlockType,
};

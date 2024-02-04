// @flow

/**
 * Internal dependencies
 */
import type { TBreakpoint } from '../../libs/block-states/types';
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
	getDeviceType: () => TBreakpoint,
	currentInnerBlock: InnerBlockModel,
	currentBlock: 'master' | InnerBlockType,
};

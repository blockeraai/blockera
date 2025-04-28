// @flow

/**
 * Internal dependencies
 */
import { useInnerBlocks } from '../../inner-blocks/hooks';
import { useStatesManager } from '../../block-states/hooks';
import type { BlockCompositeInserterProps } from '../types';

export const useBlockComposite = (
	params: Object
): BlockCompositeInserterProps => {
	const { innerBlocksProps, blockStatesProps } = params;
	const blockStates = useStatesManager(blockStatesProps);
	const innerBlocks = useInnerBlocks(
		innerBlocksProps || {
			values: {},
			block: {},
			onChange: () => {},
			innerBlocks: {},
		}
	);

	return {
		inserterProps: {
			blocks: innerBlocks?.blocks,
			clientId: innerBlocks?.clientId,
			elements: innerBlocks?.elements,
			states: blockStates?.preparedStates,
			setBlockState: blockStates?.handleOnChange,
			getBlockInners: innerBlocks?.getBlockInners,
			setCurrentBlock: innerBlocks?.setCurrentBlock,
			innerBlocksLength: innerBlocks?.innerBlocksLength,
			setBlockClientInners: innerBlocks?.setBlockClientInners,
		},
		innerBlocks: {
			...innerBlocks,
			...innerBlocksProps,
		},
		blockStates,
	};
};

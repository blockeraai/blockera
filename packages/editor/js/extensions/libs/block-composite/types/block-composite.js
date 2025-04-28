// @flow

/**
 * Internal dependencies
 */
import type {
	InnerBlocksProps,
	InnerBlockExtensionProps,
	InnerBlocksProvidedProps,
} from '../../inner-blocks/types';
import type {
	StatesManagerProps,
	StatesManager,
} from '../../block-states/types';

export type BlockCompositeProps = {
	innerBlocksProps?: InnerBlocksProps,
	blockStatesProps: StatesManagerProps,
};

export type BlockCompositeInserterProps = {
	blockStates: StatesManager,
	innerBlocks: InnerBlockExtensionProps,
	inserterProps: {
		states: StatesManager['states'],
		blocks: InnerBlocksProvidedProps['blocks'],
		elements: InnerBlocksProvidedProps['elements'],
		setBlockState: InnerBlockExtensionProps['onChange'],
		setCurrentBlock: InnerBlocksProvidedProps['setCurrentBlock'],
		setBlockClientInners: InnerBlockExtensionProps['setBlockClientInners'],
		clientId: InnerBlocksProvidedProps['clientId'],
		getBlockInners: InnerBlocksProvidedProps['getBlockInners'],
		innerBlocksLength: number,
		setBlockState: StatesManager['handleOnChange'],
	},
};

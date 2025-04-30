//@flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/block-card/inner-blocks/types';
import type { BlockStateType } from '@blockera/editor/js/extensions/libs/block-card/block-states/test/states';

export type BlockType = {
	name: string,
	targetBlock: string,
	blockeraInnerBlocks?: InnerBlocks,
	edit: (props: Object) => MixedElement,
	availableBlockStates?: {
		[key: string]: BlockStateType,
	},
	registerExtensions?: (blockName: string) => void,
	supports?: Object,
};

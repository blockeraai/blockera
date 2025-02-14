//@flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import type { BlockStateType } from '@blockera/editor/js/extensions/libs/block-states/states';

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

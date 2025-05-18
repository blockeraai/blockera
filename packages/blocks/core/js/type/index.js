//@flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import type { StateTypes } from '@blockera/editor/js/extensions/libs/block-card/block-states/types';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/block-card/inner-blocks/types';

export type BlockType = {
	name: string,
	targetBlock: string,
	maxInnerBlocks?: number,
	blockeraInnerBlocks?: InnerBlocks,
	edit: (props: Object) => MixedElement,
	availableBlockStates?: {
		[key: string]: StateTypes,
	},
	registerExtensions?: (blockName: string) => void,
	supports?: Object,
};

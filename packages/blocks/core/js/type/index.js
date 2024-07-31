//@flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

export type BlockType = {
	name: string,
	targetBlock: string,
	blockeraInnerBlocks: InnerBlocks,
	edit: (props: Object) => MixedElement,
};

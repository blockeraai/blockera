// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../../type';

export const PostExcerpt: BlockType = {
	name: 'blockeraPostExcerpt',
	targetBlock: 'core/post-excerpt',
	blockeraInnerBlocks: {
		'elements/link': sharedInnerBlocks['elements/link'],
		'elements/bold': sharedInnerBlocks['elements/bold'],
		'elements/italic': sharedInnerBlocks['elements/italic'],
		'elements/kbd': sharedInnerBlocks['elements/kbd'],
		'elements/code': sharedInnerBlocks['elements/code'],
		'elements/span': sharedInnerBlocks['elements/span'],
		'elements/mark': sharedInnerBlocks['elements/mark'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

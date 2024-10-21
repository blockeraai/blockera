// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';
import sharedInnerBlocks from '../inners/shared';

export const HomeLink: BlockType = {
	name: 'blockeraHomeLink',
	targetBlock: 'core/home-link',
	blockeraInnerBlocks: {
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const BlocksyPostTemplate: BlockType = {
	name: 'blockeraBlocksyPostTemplate',
	targetBlock: 'blocksy/post-template',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

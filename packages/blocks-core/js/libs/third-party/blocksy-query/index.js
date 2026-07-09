// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const BlocksyQuery: BlockType = {
	name: 'blockeraBlocksyQuery',
	targetBlock: 'blocksy/query',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

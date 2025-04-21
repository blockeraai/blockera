// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const ReadMore: BlockType = {
	name: 'blockeraReadMore',
	targetBlock: 'core/read-more',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

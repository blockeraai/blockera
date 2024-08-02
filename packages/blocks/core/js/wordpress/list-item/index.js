// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const ListItem: BlockType = {
	name: 'blockeraListItem',
	targetBlock: 'core/list-item',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

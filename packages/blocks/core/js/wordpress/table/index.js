// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const Table: BlockType = {
	name: 'blockeraTable',
	targetBlock: 'core/table',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

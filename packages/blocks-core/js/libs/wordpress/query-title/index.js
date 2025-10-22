// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const QueryTitle: BlockType = {
	name: 'blockeraQueryTitle',
	targetBlock: 'core/query-title',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const QueryTotal: BlockType = {
	name: 'blockeraQueryTotal',
	targetBlock: 'core/query-total',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

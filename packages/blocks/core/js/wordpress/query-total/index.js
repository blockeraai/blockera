// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const QueryTotal: BlockType = {
	name: 'blockeraQueryTotal',
	targetBlock: 'core/query-total',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

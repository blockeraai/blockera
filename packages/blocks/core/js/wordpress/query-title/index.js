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

export const QueryTitle: BlockType = {
	name: 'blockeraQueryTitle',
	targetBlock: 'core/query-title',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

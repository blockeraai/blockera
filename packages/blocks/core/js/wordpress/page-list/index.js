// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const PageList: BlockType = {
	name: 'blockeraPageList',
	targetBlock: 'core/page-list',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

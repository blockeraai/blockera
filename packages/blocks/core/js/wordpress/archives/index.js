// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const Archives: BlockType = {
	name: 'blockeraArchives',
	targetBlock: 'core/archives',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

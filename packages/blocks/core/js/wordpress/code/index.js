// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const Code: BlockType = {
	name: 'blockeraCode',
	targetBlock: 'core/code',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const Avatar: BlockType = {
	name: 'blockeraAvatar',
	targetBlock: 'core/avatar',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

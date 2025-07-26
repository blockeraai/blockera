// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const Audio: BlockType = {
	name: 'blockeraAudio',
	targetBlock: 'core/audio',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

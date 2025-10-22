// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const Video: BlockType = {
	name: 'blockeraVideo',
	targetBlock: 'core/video',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

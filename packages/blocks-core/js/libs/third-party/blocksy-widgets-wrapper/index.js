// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const BlocksyWidgetsWrapper: BlockType = {
	name: 'blockeraBlocksyWidgetsWrapper',
	targetBlock: 'blocksy/widgets-wrapper',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

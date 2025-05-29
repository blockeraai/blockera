// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const OutermostIconBlock: BlockType = {
	name: 'blockeraOutermostIconBlock',
	targetBlock: 'outermost/icon-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

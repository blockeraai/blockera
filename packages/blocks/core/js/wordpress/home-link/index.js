// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const HomeLink: BlockType = {
	name: 'blockeraHomeLink',
	targetBlock: 'core/home-link',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

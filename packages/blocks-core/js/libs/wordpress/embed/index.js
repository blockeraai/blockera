// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const Embed: BlockType = {
	name: 'blockeraEmbed',
	targetBlock: 'core/embed',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

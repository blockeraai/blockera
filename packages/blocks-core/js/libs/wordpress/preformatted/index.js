// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const Preformatted: BlockType = {
	name: 'blockeraPreformatted',
	targetBlock: 'core/preformatted',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

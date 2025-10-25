// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const Separator: BlockType = {
	name: 'blockeraSeparator',
	targetBlock: 'core/separator',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

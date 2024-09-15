// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const NavigationLink: BlockType = {
	name: 'blockeraNavigationLink',
	targetBlock: 'core/navigation-link',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

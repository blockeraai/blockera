// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const SiteLogo: BlockType = {
	name: 'blockeraSiteLogo',
	targetBlock: 'core/site-logo',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

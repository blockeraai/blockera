// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const SiteTagline: BlockType = {
	name: 'blockeraSiteTagline',
	targetBlock: 'core/site-tagline',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

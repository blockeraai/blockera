// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const PostFeaturedImage: BlockType = {
	name: 'blockeraPostFeaturedImage',
	targetBlock: 'core/post-featured-image',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

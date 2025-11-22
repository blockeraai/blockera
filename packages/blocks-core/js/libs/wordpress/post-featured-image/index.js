// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

const imageSelector =
	'.wp-block-post-featured-image img,.wp-block-post-featured-image .components-placeholder';

export const PostFeaturedImage: BlockType = {
	name: 'blockeraPostFeaturedImage',
	targetBlock: 'core/post-featured-image',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	selectors: {
		blockeraWidth: {
			root: imageSelector,
		},
		blockeraMinWidth: {
			root: imageSelector,
		},
		blockeraMaxWidth: {
			root: imageSelector,
		},
		blockeraHeight: {
			root: imageSelector,
		},
		blockeraMinHeight: {
			root: imageSelector,
		},
		blockeraMaxHeight: {
			root: imageSelector,
		},
		blockeraRatio: {
			root: imageSelector,
		},
	},
};

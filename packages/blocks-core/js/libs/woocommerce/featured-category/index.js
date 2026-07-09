// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceFeaturedCategory: BlockType = {
	name: 'blockeraWooCommerceFeaturedCategory',
	targetBlock: 'woocommerce/featured-category',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductReviews: BlockType = {
	name: 'blockeraWooCommerceProductReviews',
	targetBlock: 'woocommerce/product-reviews',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

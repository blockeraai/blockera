// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductRatingStars: BlockType = {
	name: 'blockeraWooCommerceProductRatingStars',
	targetBlock: 'woocommerce/product-rating-stars',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductRatingCounter: BlockType = {
	name: 'blockeraWooCommerceProductRatingCounter',
	targetBlock: 'woocommerce/product-rating-counter',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductRating: BlockType = {
	name: 'blockeraWooCommerceProductRating',
	targetBlock: 'woocommerce/product-rating',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

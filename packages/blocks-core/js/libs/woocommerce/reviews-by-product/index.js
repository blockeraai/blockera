// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceReviewsByProduct: BlockType = {
	name: 'blockeraWooCommerceReviewsByProduct',
	targetBlock: 'woocommerce/reviews-by-product',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceReviewsByCategory: BlockType = {
	name: 'blockeraWooCommerceReviewsByCategory',
	targetBlock: 'woocommerce/reviews-by-category',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

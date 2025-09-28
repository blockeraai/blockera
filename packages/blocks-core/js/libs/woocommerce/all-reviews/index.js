// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceAllReviews: BlockType = {
	name: 'blockeraWooCommerceAllReviews',
	targetBlock: 'woocommerce/all-reviews',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

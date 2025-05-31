// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductAverageRating: BlockType = {
	name: 'WooCommerceProductAverageRating',
	targetBlock: 'woocommerce/product-average-rating',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceProductDetails: BlockType = {
	name: 'blockeraWooCommerceProductDetails',
	targetBlock: 'woocommerce/product-details',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

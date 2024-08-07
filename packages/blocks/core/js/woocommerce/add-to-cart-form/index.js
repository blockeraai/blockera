// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceAddToCartForm: BlockType = {
	name: 'blockeraWooCommerceAddToCartForm',
	targetBlock: 'woocommerce/add-to-cart-form',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

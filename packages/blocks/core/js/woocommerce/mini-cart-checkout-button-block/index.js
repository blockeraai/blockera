// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceMiniCartCheckoutButtonBlock: BlockType = {
	name: 'blockeraWooCommerceMiniCartCheckoutButtonBlock',
	targetBlock: 'woocommerce/mini-cart-checkout-button-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceCartAcceptedPaymentMethodsBlock: BlockType = {
	name: 'blockeraWooCommerceCartAcceptedPaymentMethodsBlock',
	targetBlock: 'woocommerce/cart-accepted-payment-methods-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

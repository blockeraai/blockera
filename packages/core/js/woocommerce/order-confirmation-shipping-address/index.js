// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceOrderConfirmationShippingAddress: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationShippingAddress',
	targetBlock: 'woocommerce/order-confirmation-shipping-address',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

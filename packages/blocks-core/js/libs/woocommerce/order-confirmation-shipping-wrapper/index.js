// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceOrderConfirmationShippingWrapper: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationShippingWrapper',
	targetBlock: 'woocommerce/order-confirmation-shipping-wrapper',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

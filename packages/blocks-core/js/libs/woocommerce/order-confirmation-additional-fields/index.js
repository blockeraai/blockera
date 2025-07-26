// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceOrderConfirmationAdditionalFields: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationAdditionalFields',
	targetBlock: 'woocommerce/order-confirmation-additional-fields',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

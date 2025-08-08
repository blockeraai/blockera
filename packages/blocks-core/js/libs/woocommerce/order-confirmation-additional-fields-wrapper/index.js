// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceOrderConfirmationAdditionalFieldsWrapper: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationAdditionalFieldsWrapper',
	targetBlock: 'woocommerce/order-confirmation-additional-fields-wrapper',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

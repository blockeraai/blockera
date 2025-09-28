// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCustomerAccount: BlockType = {
	name: 'blockeraWooCommerceCustomerAccount',
	targetBlock: 'woocommerce/customer-account',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

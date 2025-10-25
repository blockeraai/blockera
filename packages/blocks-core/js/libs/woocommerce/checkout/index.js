// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCheckout: BlockType = {
	name: 'blockeraWooCommerceCheckout',
	targetBlock: 'woocommerce/checkout',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

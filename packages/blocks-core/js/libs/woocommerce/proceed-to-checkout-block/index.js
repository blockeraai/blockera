// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProceedToCheckoutBlock: BlockType = {
	name: 'blockeraWooCommerceProceedToCheckoutBlock',
	targetBlock: 'woocommerce/proceed-to-checkout-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

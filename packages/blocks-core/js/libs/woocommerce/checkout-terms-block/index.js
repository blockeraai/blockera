// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceCheckoutTermsBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutTermsBlock',
	targetBlock: 'woocommerce/checkout-terms-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

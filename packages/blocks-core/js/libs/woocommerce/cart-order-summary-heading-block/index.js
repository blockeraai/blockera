// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCartOrderSummaryHeadingBlock: BlockType = {
	name: 'blockeraWooCommerceCartOrderSummaryHeadingBlock',
	targetBlock: 'woocommerce/cart-order-summary-heading-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

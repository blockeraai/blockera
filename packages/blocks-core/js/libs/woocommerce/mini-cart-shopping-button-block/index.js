// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceMiniCartShoppingButtonBlock: BlockType = {
	name: 'blockeraWooCommerceMiniCartShoppingButtonBlock',
	targetBlock: 'woocommerce/mini-cart-shopping-button-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

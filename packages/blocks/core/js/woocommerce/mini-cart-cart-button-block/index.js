// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceMiniCartCartButtonBlock: BlockType = {
	name: 'blockeraWooCommerceMiniCartCartButtonBlock',
	targetBlock: 'woocommerce/mini-cart-cart-button-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

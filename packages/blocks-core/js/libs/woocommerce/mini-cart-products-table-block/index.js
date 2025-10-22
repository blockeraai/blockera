// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceMiniCartProductsTableBlock: BlockType = {
	name: 'blockeraWooCommerceMiniCartProductsTableBlock',
	targetBlock: 'woocommerce/mini-cart-products-table-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

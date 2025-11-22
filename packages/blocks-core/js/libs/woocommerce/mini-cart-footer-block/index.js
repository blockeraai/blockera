// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceMiniCartFooterBlock: BlockType = {
	name: 'blockeraWooCommerceMiniCartFooterBlock',
	targetBlock: 'woocommerce/mini-cart-footer-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

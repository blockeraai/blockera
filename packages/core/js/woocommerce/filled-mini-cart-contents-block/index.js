// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceFilledMiniCartContentsBlock: BlockType = {
	name: 'blockeraWooCommerceFilledMiniCartContentsBlock',
	targetBlock: 'woocommerce/filled-mini-cart-contents-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

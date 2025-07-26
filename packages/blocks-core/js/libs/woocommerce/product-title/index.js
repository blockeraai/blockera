// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductTitle: BlockType = {
	name: 'blockeraWooCommerceProductTitle',
	targetBlock: 'woocommerce/product-title',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

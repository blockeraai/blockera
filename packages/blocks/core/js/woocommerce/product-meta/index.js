// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductMeta: BlockType = {
	name: 'blockeraWooCommerceProductMeta',
	targetBlock: 'woocommerce/product-meta',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

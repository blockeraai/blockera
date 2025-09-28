// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceProductCollectionNoResults: BlockType = {
	name: 'blockeraWooCommerceProductCollectionNoResults',
	targetBlock: 'woocommerce/product-collection-no-results',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

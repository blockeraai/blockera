// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductResultsCount: BlockType = {
	name: 'blockeraWooCommerceProductResultsCount',
	targetBlock: 'woocommerce/product-results-count',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

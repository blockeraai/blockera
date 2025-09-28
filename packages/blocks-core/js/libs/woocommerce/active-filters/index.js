// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceActiveFilters: BlockType = {
	name: 'blockeraWooCommerceActiveFilters',
	targetBlock: 'woocommerce/active-filters',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

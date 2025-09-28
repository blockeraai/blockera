// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCatalogSorting: BlockType = {
	name: 'blockeraWooCommerceCatalogSorting',
	targetBlock: 'woocommerce/catalog-sorting',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

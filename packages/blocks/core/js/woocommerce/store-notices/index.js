// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceStoreNotices: BlockType = {
	name: 'blockeraWooCommerceStoreNotices',
	targetBlock: 'woocommerce/store-notices',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

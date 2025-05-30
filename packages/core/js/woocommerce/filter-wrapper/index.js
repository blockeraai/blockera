// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceFilterWrapper: BlockType = {
	name: 'blockeraWooCommerceFilterWrapper',
	targetBlock: 'woocommerce/filter-wrapper',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

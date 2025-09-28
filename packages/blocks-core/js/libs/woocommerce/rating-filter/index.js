// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceRatingFilter: BlockType = {
	name: 'blockeraWooCommerceRatingFilter',
	targetBlock: 'woocommerce/rating-filter',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

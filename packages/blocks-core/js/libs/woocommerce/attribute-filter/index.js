// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceAttributeFilter: BlockType = {
	name: 'blockeraWooCommerceAttributeFilter',
	targetBlock: 'woocommerce/attribute-filter',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const BlocksyTaxTemplate: BlockType = {
	name: 'blockeraBlocksyTaxTemplate',
	targetBlock: 'blocksy/tax-template',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};

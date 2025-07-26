/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

/**
 * We should monitor all available blocks in WordPress to make sure
 * we have them in our supported blocks list.
 *
 * For this purpose, we track all blocks and compare them with our
 * supported blocks list to ensure we haven't missed any new blocks.
 *
 * This test runs on WooCommerce category on CI to detect core and WooCommerce blocks.
 */

import * as thirdPartyBlocks from '../js/libs/third-party-blocks-list.json';
import * as wooCommerceBlocks from '../js/libs/woocommerce-blocks-list.json';
import * as wordpressBlocks from '../js/libs/wordpress-blocks-list.json';

describe('Blocks → Blocks List Monitoring', () => {
	beforeEach(() => {
		createPost();
	});

	it('Check for new blocks that are not in our supported lists', () => {
		cy.window()
			.its('wp.data')
			.then((data) => {
				const allKnownBlocks = new Set([
					// Supported blocks
					...thirdPartyBlocks.supported.map((block) => block.name),
					...wooCommerceBlocks.supported.map((block) => block.name),
					...wordpressBlocks.supported.map((block) => block.name),
					// No need to support blocks
					...thirdPartyBlocks['no-need-to-support'].map(
						(block) => block.name
					),
					...wooCommerceBlocks['no-need-to-support'].map(
						(block) => block.name
					),
					...wordpressBlocks['no-need-to-support'].map(
						(block) => block.name
					),
					// Not supported blocks (but we know about them)
					...thirdPartyBlocks['not-supported'].map(
						(block) => block.name
					),
					...wooCommerceBlocks['not-supported'].map(
						(block) => block.name
					),
					...wordpressBlocks['not-supported'].map(
						(block) => block.name
					),
				]);

				const allBlocks = data.select('core/blocks').getBlockTypes();

				const newBlocks = allBlocks.filter(
					(block) => !allKnownBlocks.has(block.name)
				);

				// If there are new blocks, fail the test and show which blocks are missing
				if (newBlocks.length > 0) {
					const newBlockNames = newBlocks
						.map((block) => block.name)
						.join(', ');
					throw new Error(
						`New blocks found that are not in our lists: ${newBlockNames}`
					);
				}
			});
	});
});

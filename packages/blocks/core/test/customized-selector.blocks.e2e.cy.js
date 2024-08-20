/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

/**
 * We should have deep integration with WP attributes and selectors of CSS engine
 * to make sure our CSS engine Works properly in editor and front-end.
 *
 * For making sure, we have to sure we know which blocks have customized selector and track them
 * for integrating and supporting them inside Blockera.
 *
 * For this purpose, we track the blocks selectors and keep a static one (updated) always.
 */

/**
 * Generated by blockTypesWithCustomizedSelectorsNoneBlockera in `/.patch/code-snippet.js`
 **/
import * as cachedCustomizedSelectors from './customized-selector-blocks-cache.json';

describe('Blocks → Customized Selectors Monitoring', () => {
	beforeEach(() => {
		createPost();
	});

	it('Check Attributes CSS selectors customization to work in editor and front-end', () => {
		cy.window()
			.its('wp.data')
			.then((data) => {
				let newCustomizedBlocks = {};

				//
				// Create list of blocks with customized selector
				//
				data.select('core/blocks')
					.getBlockTypes()
					.filter((block) => {
						if (Array.isArray(block.selectors)) {
							return false;
						}

						const selectors = Object.fromEntries(
							Object.entries(block.selectors).filter(
								([key]) => !key.startsWith('blockera')
							)
						);

						if (Object.keys(selectors).length > 0) {
							newCustomizedBlocks[block.name] = selectors;
						}

						return false;
					});

				//
				// Assert
				//
				Object.keys(newCustomizedBlocks).forEach((key) => {
					// Block should exists
					// If this fails it means new customized block available now
					expect(
						cachedCustomizedSelectors[key],
						`Block: ${key} existence`
					).to.not.be.undefined;

					Object.keys(cachedCustomizedSelectors[key]).forEach(
						(property) => {
							// Property should exists
							// If this fails it means new customized block available now
							expect(
								cachedCustomizedSelectors[key][property],
								`Block: ${key} Property: ${property} existence`
							).to.not.be.undefined;

							// Property should have same value as in new customized block
							expect(
								cachedCustomizedSelectors[key][property],
								`Block: ${key} Property: ${property} equality`
							).to.deep.equal(newCustomizedBlocks[key][property]);
						}
					);
				});
			});
	});
});

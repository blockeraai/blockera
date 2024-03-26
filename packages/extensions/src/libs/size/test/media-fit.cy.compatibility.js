/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Media Fit → WP Compatibility', () => {
	// core/post-featured-image Block is the same as core/image
	describe('core/image Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","linkDestination":"none","className":"is-resized"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60" style="aspect-ratio:4/3;object-fit:cover"/></figure>\n' +
					'<!-- /wp:image -->'
			);

			// Select target block
			cy.getBlock('core/image').click();

			// add alias to the feature container
			cy.getParentContainer('Media Fit').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('cover').to.be.equal(
					getSelectedBlock(data, 'publisherFit')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('[aria-haspopup="listbox"]').click();
				cy.get('ul').get('li').contains('Contain').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('contain').to.be.equal(getSelectedBlock(data, 'scale'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('[aria-haspopup="listbox"]').click();
				cy.get('ul').get('li').contains('Default').click();
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'scale'));
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"aspectRatio":"4/3","scale":"contain","sizeSlug":"full","linkDestination":"none","className":"is-resized"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60" style="aspect-ratio:4/3;object-fit:contain"/></figure>\n' +
					'<!-- /wp:image -->'
			);
			// Select target block
			cy.getBlock('core/image').click();

			// add alias to the feature container
			cy.getParentContainer('Media Fit').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('contain').to.be.equal(
					getSelectedBlock(data, 'publisherFit')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('[aria-haspopup="listbox"]').click();
				cy.get('ul').get('li').contains('None').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'scale'));
			});
		});
	});
});

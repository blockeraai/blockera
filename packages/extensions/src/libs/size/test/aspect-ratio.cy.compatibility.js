/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Aspect Ratio → WP Compatibility', () => {
	// The "core/post-featured-image" is the same as "core/image"
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
			cy.getParentContainer('Aspect Ratio', 'base-control').as(
				'aspectContainer'
			);

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('4/3').to.be.equal(
					getSelectedBlock(data, 'publisherRatio')?.value
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@aspectContainer').within(() => {
				cy.get('select').as('aspectSelect');
				cy.get('@aspectSelect').select('16/9');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('16/9').to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@aspectContainer').within(() => {
				cy.get('select').select('', { force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","linkDestination":"none","className":"is-resized"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60" style="aspect-ratio:4/3;object-fit:cover"/></figure>\n' +
					'<!-- /wp:image -->'
			);

			// Select target block
			cy.getBlock('core/image').click();

			// add alias to the feature container
			cy.getParentContainer('Aspect Ratio', 'base-control').as(
				'aspectContainer'
			);

			//
			// Test 1: Blockera data to WP
			//

			// change value
			cy.get('@aspectContainer').within(() => {
				cy.get('select').as('aspectSelect');
				cy.get('@aspectSelect').select('custom', { force: true });

				// set width
				cy.get('input').eq(0).type('2');

				// set height
				cy.get('input').eq(1).type('3');
			});

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			// only % is valid for WP
			cy.get('@aspectContainer').within(() => {
				cy.get('select').as('aspectSelect');
				cy.get('@aspectSelect').select('', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'aspectRatio')
				);
			});
		});
	});
});

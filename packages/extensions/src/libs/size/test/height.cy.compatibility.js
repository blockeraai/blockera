/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Height → WP Compatibility', () => {
	describe('core/image Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"height":"500px","sizeSlug":"full","linkDestination":"none"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60" style="height:500px"/></figure>\n' +
					'<!-- /wp:image -->'
			);

			// Select target block
			cy.get('[data-type="core/image"]').click();

			// add alias to the feature container
			cy.get('[aria-label="Height"]')
				.closest('[data-cy="base-control"]')
				.as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('500px').to.be.equal(
					getSelectedBlock(data, 'publisherHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').clear();
				cy.get('@containerInput').type('200', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('200px').to.be.equal(getSelectedBlock(data, 'height'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:image {"id":60,"sizeSlug":"full","linkDestination":"none","className":"is-resized"} -->\n' +
					'<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="" class="wp-image-60"/></figure>\n' +
					'<!-- /wp:image -->'
			);

			// Select target block
			cy.get('[data-type="core/image"]').click();

			// add alias to the feature container
			cy.get('[aria-label="Height"]')
				.closest('[data-cy="base-control"]')
				.as('container');

			//
			// Test 1: Blockera dat to WP
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').type('300', { force: true });
				cy.get('[aria-label="Select Unit"]').select('px');
			});

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('300px').to.be.equal(
					getSelectedBlock(data, 'publisherHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			// only px is valid for WP
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').clear();
				cy.get('@containerInput').type('200', { force: true });
				cy.get('[aria-label="Select Unit"]').select('%');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});
		});
	});

	describe('core/post-featured-image Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:post-featured-image {"aspectRatio":"auto","height":"200px"} /-->'
			);

			// Select target block
			cy.get('[data-type="core/post-featured-image"]').click();

			// add alias to the feature container
			cy.get('[aria-label="Height"]')
				.closest('[data-cy="base-control"]')
				.as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('200px').to.be.equal(
					getSelectedBlock(data, 'publisherHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').clear();
				cy.get('@containerInput').type('300', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('300px').to.be.equal(getSelectedBlock(data, 'height'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:post-featured-image {"aspectRatio":"auto","height":"30%"} /-->'
			);

			// Select target block
			cy.get('[data-type="core/post-featured-image"]').click();

			// add alias to the feature container
			cy.get('[aria-label="Height"]')
				.closest('[data-cy="base-control"]')
				.as('container');

			//
			// Test 1: Blockera dat to WP
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('30%').to.be.equal(
					getSelectedBlock(data, 'publisherHeight')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@container').within(() => {
				cy.get('[aria-label="Select Unit"]').select('auto');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'height'));
			});
		});
	});
});

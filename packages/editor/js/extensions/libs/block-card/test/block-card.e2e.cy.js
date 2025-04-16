/**
 * Blockera dependencies
 */
import { createPost, appendBlocks } from '@blockera/dev-cypress/js/helpers';

describe('Block Card', () => {
	beforeEach(() => {
		createPost();
	});

	it('Check block card to be sticky while scrolling', () => {
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.get('.editor-sidebar').scrollTo('bottom');

		cy.get('.blockera-block-card-wrapper').should('be.visible');
		cy.get('.blockera-block-card-wrapper').should('have.class', 'is-stuck');
	});

	it('Check showing block custom name', () => {
		appendBlocks(`<!-- wp:paragraph {"metadata":{"name":"My custom name"}} -->
<p>Block with custom name</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Block with default name</p>
<!-- /wp:paragraph -->
			`);

		//
		// Switch to first block and check block card title
		//
		cy.getBlock('core/paragraph').first().click();

		cy.get('.blockera-extension-block-card__title__block').should(
			'have.text',
			'My custom name'
		);

		//
		// Switch to second block and check block card title
		//
		cy.getBlock('core/paragraph').last().click();

		cy.get('.blockera-extension-block-card__title__block').should(
			'have.text',
			'Paragraph'
		);
	});
});

/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

describe('Block Card → Sticky While Scrolling', () => {
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
});

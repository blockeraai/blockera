/**
 * Internal dependencies
 */
import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Overflow → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('should update overflow to visible', () => {
		// should update overflow to visible
		cy.getParentContainer('Overflow').as('overflow');

		cy.get('@overflow').within(() => {
			cy.get('button[aria-label="Visible Overflow"]').click();
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'overflow', 'visible');

		// Check store
		getWPDataObject().then((data) => {
			expect('visible').to.be.equal(
				getSelectedBlock(data, 'publisherOverflow')
			);
		});

		//
		// should update overflow to hidden
		//
		cy.get('@overflow').within(() => {
			cy.get('button[aria-label="Hidden Overflow"]').click();
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'overflow', 'hidden');

		// Check store
		getWPDataObject().then((data) => {
			expect('hidden').to.be.equal(
				getSelectedBlock(data, 'publisherOverflow')
			);
		});

		//
		// should update overflow to scroll
		//
		cy.get('@overflow').within(() => {
			cy.get('button[aria-label="Scroll Overflow"]').click();
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'overflow', 'scroll');

		// Check store
		getWPDataObject().then((data) => {
			expect('scroll').to.be.equal(
				getSelectedBlock(data, 'publisherOverflow')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'overflow',
			'scroll'
		);
	});
});

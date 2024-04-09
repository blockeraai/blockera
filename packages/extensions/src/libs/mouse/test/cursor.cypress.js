import {
	getWPDataObject,
	getSelectedBlock,
	addBlockToPost,
	savePage,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Cursor → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', {
			delay: 0,
		});

		cy.getByDataTest('interactions-tab').click();

		cy.getParentContainer('Cursor').as('container');
	});

	it('should update cursor correctly, when add wait', () => {
		cy.get('@container').within(() => {
			cy.customSelect('wait');
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'cursor', 'wait');

		// Check store
		getWPDataObject().then((data) => {
			expect('wait').to.be.equal(
				getSelectedBlock(data, 'publisherCursor')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should('have.css', 'cursor', 'wait');
	});
});

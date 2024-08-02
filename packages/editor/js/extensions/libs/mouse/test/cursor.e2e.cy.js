import {
	getWPDataObject,
	getSelectedBlock,
	savePage,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Cursor → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });

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
				getSelectedBlock(data, 'blockeraCursor')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'cursor', 'wait');
	});
});

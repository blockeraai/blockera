import {
	getWPDataObject,
	getSelectedBlock,
	savePage,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('User Select → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });

		cy.getByDataTest('interactions-tab').click();

		cy.getParentContainer('User Select').as('container');
	});

	it('should update user-select correctly, when select text', () => {
		cy.get('@container').within(() => {
			cy.get('select').select('text');
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'user-select', 'text');

		//Check store
		getWPDataObject().then((data) => {
			expect('text').to.be.equal(
				getSelectedBlock(data, 'blockeraUserSelect')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'user-select', 'text');
	});
});

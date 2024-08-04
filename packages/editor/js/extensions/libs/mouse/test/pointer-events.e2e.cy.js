import {
	getWPDataObject,
	getSelectedBlock,
	savePage,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Pointer Events → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });

		cy.getByDataTest('interactions-tab').click();

		cy.getParentContainer('Pointer Events').as('container');
	});

	it('should update pointer-events correctly, when select all', () => {
		cy.get('@container').within(() => {
			cy.get('select').select('all');
		});

		// Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'pointer-events',
			'all'
		);

		// Check store
		getWPDataObject().then((data) => {
			expect('all').to.be.equal(
				getSelectedBlock(data, 'blockeraPointerEvents')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'pointer-events', 'all');
	});
});

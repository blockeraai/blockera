import {
	getWPDataObject,
	getSelectedBlock,
	addBlockToPost,
	savePage,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Pointer Events → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', {
			delay: 0,
		});

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

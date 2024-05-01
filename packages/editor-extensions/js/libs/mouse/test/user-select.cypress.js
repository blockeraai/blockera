import {
	getWPDataObject,
	getSelectedBlock,
	addBlockToPost,
	savePage,
	redirectToFrontPage,
	createPost,
} from '../../../../../../cypress/helpers';

describe('User Select → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', {
			delay: 0,
		});

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

		cy.get('.blockera-core-block').should(
			'have.css',
			'user-select',
			'text'
		);
	});
});

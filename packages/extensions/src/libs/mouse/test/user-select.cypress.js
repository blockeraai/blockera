import {
	getWPDataObject,
	getSelectedBlock,
	addBlockToPost,
	savePage,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('User Select → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

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
				getSelectedBlock(data, 'publisherUserSelect')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'user-select',
			'text'
		);
	});
});

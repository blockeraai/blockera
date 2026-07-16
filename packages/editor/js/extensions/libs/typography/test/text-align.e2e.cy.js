import {
	savePage,
	createPost,
	assertBlockData,
	getSelectedBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Text Align → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByAriaControls('styles-view').click();
	});

	it('simple value', () => {
		// center align
		cy.getByAriaLabel('Center').click();

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'text-align',
			'center'
		);

		//Check store
		assertBlockData((data) => {
			expect('center').to.be.equal(
				getSelectedBlock(data, 'blockeraTextAlign')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'text-align', 'center');
	});
});

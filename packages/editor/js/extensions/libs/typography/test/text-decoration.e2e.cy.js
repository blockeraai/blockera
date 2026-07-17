import {
	savePage,
	assertBlockData,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Text Decoration → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByAriaControls('styles-view').click();
	});

	it('simple value', () => {
		openMoreFeaturesControl('More typography settings');

		cy.getByAriaLabel('Overline').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'text-decoration')
			.should('include', 'overline');

		//Check store
		assertBlockData((data) => {
			expect('overline').to.be.equal(
				getSelectedBlock(data, 'blockeraTextDecoration')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block')
			.should('have.css', 'text-decoration')
			.should('include', 'overline');
	});
});

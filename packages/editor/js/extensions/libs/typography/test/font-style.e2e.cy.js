import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Font Style → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('simple value', () => {
		openMoreFeaturesControl('More typography settings');

		cy.getByAriaLabel('Italic style').click();

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'font-style',
			'italic'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('italic').to.be.equal(
				getSelectedBlock(data, 'blockeraFontStyle')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'font-style', 'italic');
	});
});

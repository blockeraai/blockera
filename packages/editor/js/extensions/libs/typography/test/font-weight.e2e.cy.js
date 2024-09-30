import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Font Weight → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('simple value', () => {
		cy.getParentContainer('Font Weight').within(() => {
			cy.get('select').select('800');
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'font-weight', '800');

		//Check store
		getWPDataObject().then((data) => {
			expect('800').to.be.equal(
				getSelectedBlock(data, 'blockeraFontWeight')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'font-weight', '800');
	});
});

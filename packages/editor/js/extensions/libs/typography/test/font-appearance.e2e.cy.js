import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Font Appearance → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('simple value', () => {
		cy.getParentContainer('Appearance').within(() => {
			cy.get('select').select('800-normal');
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'font-weight', '800');
		cy.getBlock('core/paragraph').should('have.css', 'font-style', 'normal');

		//Check store
		getWPDataObject().then((data) => {
			expect('800').to.be.equal(
				getSelectedBlock(data, 'blockeraFontAppearance')?.weight
			);

			expect('normal').to.be.equal(
				getSelectedBlock(data, 'blockeraFontAppearance')?.style
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'font-weight', '800');
		cy.get('.blockera-block').should('have.css', 'font-style', 'normal');
	});
});

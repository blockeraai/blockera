import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Direction → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('Simple value', () => {
		openMoreFeaturesControl('More typography settings');

		cy.getByAriaLabel('Right to Left').click();

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'direction', 'rtl');

		//Check store
		getWPDataObject().then((data) => {
			expect('rtl').to.be.equal(
				getSelectedBlock(data, 'blockeraDirection')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'direction', 'rtl');
	});
});

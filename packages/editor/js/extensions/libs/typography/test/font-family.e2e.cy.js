import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Font Family → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('simple font family', () => {
		cy.getParentContainer('Font Family').as('container');

		cy.get('@container').within(() => {
			cy.get('select').select('system-sans-serif');
		});

		// Check block
		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'font-family: var(--wp--preset--font-family--system-sans-serif)'
				);
		});

		//Check store
		getWPDataObject().then((data) => {
			expect('system-sans-serif').to.be.equal(
				getSelectedBlock(data, 'blockeraFontFamily')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should(
				'include',
				'font-family: var(--wp--preset--font-family--system-sans-serif)'
			);
	});
});

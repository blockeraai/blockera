import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Text Align → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value', () => {
		openMoreFeaturesControl('More typography settings');

		// center align
		cy.getByAriaLabel('Center').click();

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'text-align',
			'center'
		);

		//Check store
		getWPDataObject().then((data) => {
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

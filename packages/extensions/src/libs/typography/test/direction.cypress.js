import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Direction → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

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

		cy.get('.blockera-core-block').should('have.css', 'direction', 'rtl');
	});
});


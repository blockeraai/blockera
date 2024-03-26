import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Direction → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('Simple value', () => {
		cy.openMoreFeatures('More typography settings');

		cy.getByAriaLabel('Right to Left').click();

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'direction', 'rtl');

		//Check store
		getWPDataObject().then((data) => {
			expect('rtl').to.be.equal(
				getSelectedBlock(data, 'publisherDirection')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should('have.css', 'direction', 'rtl');
	});
});

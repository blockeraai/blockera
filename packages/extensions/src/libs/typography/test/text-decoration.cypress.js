import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Text Decoration → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value', () => {
		cy.openMoreFeatures('More typography settings');

		cy.getByAriaLabel('Overline').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'text-decoration')
			.should('include', 'overline');

		//Check store
		getWPDataObject().then((data) => {
			expect('overline').to.be.equal(
				getSelectedBlock(data, 'publisherTextDecoration')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block')
			.should('have.css', 'text-decoration')
			.should('include', 'overline');
	});
});

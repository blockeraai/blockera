import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Display → Functionality', () => {
	beforeEach(() => {
		createPost();
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('should update display correctly, when click on buttons', () => {
		['Block', 'Flex', 'Grid', 'Inline Block', 'Inline', 'None'].forEach(
			(item) => {
				cy.getParentContainer('Display').within(() => {
					cy.getByAriaLabel(item).click();
				});

				cy.getBlock('core/paragraph').should(
					'have.css',
					'display',
					item.toLowerCase().replace(' ', '-')
				);

				getWPDataObject().then((data) => {
					expect(item.toLowerCase().replace(' ', '-')).to.be.equal(
						getSelectedBlock(data, 'blockeraDisplay')
					);
				});
			}
		);

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'display', 'none');
	});
});

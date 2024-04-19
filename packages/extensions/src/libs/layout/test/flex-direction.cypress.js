import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	addBlockToPost,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Flex Direction → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();

		// change to flex
		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
	});

	it('should update flex direction correctly', () => {
		cy.getParentContainer('Flex Layout')
			.first()
			.within(() => {
				cy.getByAriaLabel('Row').click();
			});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'flex-direction',
			'row'
		);

		getWPDataObject().then((data) => {
			expect('row').to.be.deep.equal(
				getSelectedBlock(data, 'publisherFlexLayout')?.direction
			);
		});

		cy.getParentContainer('Flex Layout')
			.first()
			.within(() => {
				cy.getByAriaLabel('Column').click();
			});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'flex-direction',
			'column'
		);

		getWPDataObject().then((data) => {
			expect('column').to.be.deep.equal(
				getSelectedBlock(data, 'publisherFlexLayout')?.direction
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'flex-direction',
			'column'
		);
	});
});

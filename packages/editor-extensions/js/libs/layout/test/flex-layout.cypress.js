import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	addBlockToPost,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Flex Layout → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

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
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
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
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'flex-direction',
			'column'
		);
	});

	it('should flex align items and justify content correctly works', () => {
		//
		// Top, Left
		//
		cy.getByDataTest('matrix-top-left-normal').click();

		cy.getBlock('core/paragraph').should(
			'have.css',
			'align-items',
			'flex-start'
		);

		cy.getBlock('core/paragraph').should(
			'have.css',
			'justify-content',
			'flex-start'
		);

		getWPDataObject().then((data) => {
			expect('flex-start').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);

			expect('flex-start').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);
		});

		//
		// Top, Center
		//
		cy.getByDataTest('matrix-top-center-normal').click();

		cy.getBlock('core/paragraph').should(
			'have.css',
			'align-items',
			'flex-start'
		);

		cy.getBlock('core/paragraph').should(
			'have.css',
			'justify-content',
			'center'
		);

		getWPDataObject().then((data) => {
			expect('flex-start').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);

			expect('center').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);
		});

		// ! note: no need to test other align items and justify content combinations

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'align-items',
			'flex-start'
		);

		cy.get('.blockera-core-block').should(
			'have.css',
			'justify-content',
			'center'
		);
	});
});

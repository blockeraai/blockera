import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	addBlockToPost,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Flex Align Items and Justify Content → Functionality', () => {
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
				getSelectedBlock(data, 'publisherFlexLayout')?.alignItems
			);

			expect('flex-start').to.be.deep.equal(
				getSelectedBlock(data, 'publisherFlexLayout')?.justifyContent
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
				getSelectedBlock(data, 'publisherFlexLayout')?.alignItems
			);

			expect('center').to.be.deep.equal(
				getSelectedBlock(data, 'publisherFlexLayout')?.justifyContent
			);
		});

		// ! note: no need to test other align items and justify content combinations

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'align-items',
			'flex-start'
		);

		cy.get('.publisher-core-block').should(
			'have.css',
			'justify-content',
			'center'
		);
	});
});

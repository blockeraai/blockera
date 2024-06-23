import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	addBlockToPost,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Display → Functionality', () => {
	beforeEach(() => {
		createPost();
		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('should update display correctly, when click on buttons', () => {
		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Block').click();
		});

		cy.getBlock('core/paragraph').should('have.css', 'display', 'block');

		getWPDataObject().then((data) => {
			expect('block').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);
		});

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});

		cy.getBlock('core/paragraph').should('have.css', 'display', 'flex');

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);
		});

		cy.getParentContainer('Display').within(() => {
			cy.get('[aria-label="Inline Block"]').click();
		});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'display',
			'inline-block'
		);

		getWPDataObject().then((data) => {
			expect('inline-block').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);
		});

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Inline').click();
		});

		cy.getBlock('core/paragraph').should('have.css', 'display', 'inline');

		getWPDataObject().then((data) => {
			expect('inline').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);
		});

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('None').click();
		});

		cy.getBlock('core/paragraph').should('have.css', 'display', 'none');

		getWPDataObject().then((data) => {
			expect('none').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'display', 'none');
	});
});

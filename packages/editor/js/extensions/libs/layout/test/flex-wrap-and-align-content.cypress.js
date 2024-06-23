import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	addBlockToPost,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Children Wrap and Align Content → Functionality', () => {
	beforeEach(() => {
		createPost();
		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
	});

	it('functionality of flex-wrap and align-content', () => {
		cy.getParentContainer('Children Wrap').within(() => {
			cy.getByAriaLabel('Wrap').click();
		});

		cy.getParentContainer('Align Content').within(() => {
			cy.getByAriaLabel('Center').click();
		});

		cy.getBlock('core/paragraph')
			.should('have.css', 'flex-wrap', 'wrap')
			.should('have.css', 'align-content', 'center');

		getWPDataObject().then((data) => {
			expect({
				value: 'wrap',
				reverse: false,
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFlexWrap'));

			expect('center').to.be.equal(
				getSelectedBlock(data, 'blockeraAlignContent')
			);
		});

		// reverse
		cy.getByAriaLabel('Reverse Children Wrapping').click();

		cy.getBlock('core/paragraph').should(
			'have.css',
			'flex-wrap',
			'wrap-reverse'
		);

		getWPDataObject().then((data) => {
			expect({
				value: 'wrap',
				reverse: true,
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFlexWrap'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block')
			.should('have.css', 'flex-wrap', 'wrap-reverse')
			.should('have.css', 'align-content', 'center');
	});
});

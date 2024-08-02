import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Children Wrap and Align Content → Functionality', () => {
	beforeEach(() => {
		createPost();
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
	});

	it('functionality of flex-wrap and align-content', () => {
		// activate flex wrap feature
		cy.activateMoreSettingsItem(
			'More Layout Settings',
			'Flex Children Wrap'
		);

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

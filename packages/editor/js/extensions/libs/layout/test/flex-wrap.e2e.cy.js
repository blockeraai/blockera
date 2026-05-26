import {
	savePage,
	createPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Children Wrap → Functionality', () => {
	beforeEach(() => {
		createPost();
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
	});

	it('functionality of flex-wrap', () => {
		cy.getParentContainer('Children Wrap').within(() => {
			cy.getByAriaLabel('Wrap').click();
		});

		cy.getBlock('core/paragraph').should('have.css', 'flex-wrap', 'wrap');

		getWPDataObject().then((data) => {
			expect({
				val: 'wrap',
				reverse: false,
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFlexWrap'));
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
				val: 'wrap',
				reverse: true,
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFlexWrap'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('p.blockera-block').should(
			'have.css',
			'flex-wrap',
			'wrap-reverse'
		);
	});
});

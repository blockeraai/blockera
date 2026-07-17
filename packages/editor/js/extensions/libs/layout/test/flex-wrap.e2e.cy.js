import {
	savePage,
	createPost,
	assertBlockData,
	getSelectedBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Flex Wrap → Functionality', () => {
	beforeEach(() => {
		createPost();
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
	});

	it('functionality of flex-wrap', () => {
		cy.openFeatureMoreSettings('more-layout-settings');
		cy.selectFeature('Flex Children Wrap');
		cy.getParentContainer('Flex Wrap').within(() => {
			cy.getByAriaLabel('Wrap').click();
		});

		cy.getBlock('core/paragraph').should('have.css', 'flex-wrap', 'wrap');

		assertBlockData((data) => {
			expect({
				val: 'wrap',
				reverse: false,
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFlexWrap'));
		});

		// reverse
		cy.getByAriaLabel('Reverse Flex Children Wrapping').click();

		cy.getBlock('core/paragraph').should(
			'have.css',
			'flex-wrap',
			'wrap-reverse'
		);

		assertBlockData((data) => {
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

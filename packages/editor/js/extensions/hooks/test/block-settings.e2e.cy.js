import { createPost } from '@blockera/dev-cypress/js/helpers/site-navigation';
import { getBlockInserter } from '@blockera/dev-cypress/js/helpers/editor';

describe('Block Settings tests ...', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('should render blockera block icon for supported WordPress core blocks', () => {
		cy.getByDataTest('Paragraph Block Icon').should(
			'have.class',
			'blockera-block-icon'
		);

		getBlockInserter().within(($el) => {
			$el[0].click();
		});

		cy.getByDataTest('Paragraph Block Icon').should(
			'have.class',
			'blockera-block-icon'
		);

		// Be sure hidden blockera block icon on toolbar.
		cy.get(
			'.block-editor-block-switcher__toggle [aria-label="Paragraph Block Icon"]'
		).should('have.css', 'display', 'none');
	});
});

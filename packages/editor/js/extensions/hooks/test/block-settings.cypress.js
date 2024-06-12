import { createPost } from '@blockera/dev-cypress/js/helpers/site-navigation';
import {
	addBlockToPost,
	getBlockInserter,
} from '@blockera/dev-cypress/js/helpers/editor';

describe('Block Settings tests ...', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');
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

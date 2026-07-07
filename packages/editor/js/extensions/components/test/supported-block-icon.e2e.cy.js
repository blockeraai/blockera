import { createPost } from '@blockera/dev-cypress/js/helpers/site-navigation';
import { openBlockInserter } from '@blockera/dev-cypress/js/helpers/editor';

describe('Supported Block Indicator Icon', () => {
	beforeEach(() => {
		createPost();
	});

	it('Show supported block icon on block inserter (Paragraph Block)', () => {
		openBlockInserter();

		const selector = `.editor-block-list-item-paragraph`;

		// should show blockera block icon on paragraph block
		cy.get(selector).should('be.visible');

		cy.get(selector).within(() => {
			cy.get('.blockera-block-icon').should('be.visible');
		});

		// search paragraph
		cy.get(
			'.block-editor-inserter__search-input,input.block-editor-inserter__search, .components-search-control__input, input[placeholder="Search"]'
		)
			.click()
			.type('paragraph', { delay: 0 });

		// should show blockera block icon on paragraph block in search panel
		cy.get(selector).within(() => {
			cy.get('.blockera-block-icon').should('be.visible');
		});
	});
});

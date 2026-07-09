import { createPost } from '@blockera/dev-cypress/js/helpers/site-navigation';
import {
	addBlockToPost,
	appendBlocks,
	getBlockInserter,
} from '@blockera/dev-cypress/js/helpers/editor';

describe('Supported Block Indicator Icon', () => {
	beforeEach(() => {
		createPost();
	});

	it('Show supported block icon on block inserter (Paragraph Block)', () => {
		getBlockInserter().click();

		// should show blockera block icon on paragraph block
		cy.get('.editor-block-list-item-paragraph').should('be.visible');
		cy.get('.editor-block-list-item-paragraph').within(() => {
			cy.get('.blockera-block-icon').should('be.visible');
		});

		// search paragraph
		cy.get(
			'.block-editor-inserter__search-input,input.block-editor-inserter__search, .components-search-control__input, input[placeholder="Search"]'
		)
			.click()
			.type('paragraph', { delay: 0 });

		// should show blockera block icon on paragraph block in search panel
		cy.get('.editor-block-list-item-paragraph').within(() => {
			cy.get('.blockera-block-icon').should('be.visible');
		});
	});
});

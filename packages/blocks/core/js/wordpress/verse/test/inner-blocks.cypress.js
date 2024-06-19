/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Verse Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(
			'<!-- wp:verse -->\n' +
				'<pre class="wp-block-verse">It\'s the verse...</pre>\n' +
				'<!-- /wp:verse -->'
		);

		// Select target block
		cy.getBlock('core/verse').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Links Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});

/**
 * Cypress dependencies
 */
import { appendBlocks, createPost } from '@blockera/dev-cypress/js/helpers';

describe('Button Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 1</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 2</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`);

		cy.getBlock('core/button').first().click();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);
	});
});

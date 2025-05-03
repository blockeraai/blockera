/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Block Style Variations', () => {
	beforeEach(() => {
		createPost();
	});

	it('Check style variations functionality', () => {
		//
		// 1. Check that style variations button is not visible for code block
		//
		appendBlocks(`<!-- wp:code -->
<pre class="wp-block-code"><code>// hello work!</code></pre>
<!-- /wp:code -->`);

		cy.getBlock('core/code').first().click();

		cy.getByDataTest('style-variations-button').should('not.exist');

		//
		// 2. Add a group block
		//
		appendBlocks(`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"color":{"background":"#ffd2d2"}}} -->
<p class="has-background" style="background-color:#ffd2d2">Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"background":"#ffe3e3"}}} -->
<p class="has-background" style="background-color:#ffe3e3">Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Group').click();

		//
		// 3. Check default variation
		//
		cy.getByDataTest('style-variations-button').should('exist');

		cy.getByDataTest('style-variations-button-label').should(
			'have.text',
			'Default'
		);

		//
		// 4. Change variation
		//
		cy.getByDataTest('style-variations-button').click();

		cy.get('.blockera-component-popover.variations-picker-popover')
			.last()
			.within(() => {
				cy.getByAriaLabel('Style 1').click();
			});

		cy.getByDataTest('style-variations-button-label').should(
			'have.text',
			'Style 1'
		);

		//
		// 5. Switch block and check variation button
		//
		cy.getBlock('core/paragraph').last().click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Group').click();

		cy.getByDataTest('style-variations-button-label').should(
			'have.text',
			'Style 1'
		);

		//
		// 6. Change variation to default
		//
		cy.getByDataTest('style-variations-button').click();

		cy.get('.blockera-component-popover.variations-picker-popover')
			.last()
			.within(() => {
				cy.getByAriaLabel('Default').click();
			});

		cy.getByDataTest('style-variations-button-label').should(
			'have.text',
			'Default'
		);

		//
		// 7. Add a block that has style variations (not a Blockera block)
		//
		appendBlocks(`<!-- wp:group {"className":"is-style-section-2","layout":{"type":"constrained"}} -->
<div class="wp-block-group is-style-section-2"><!-- wp:paragraph {"style":{"color":{"background":"#ffd2d2"}}} -->
<p class="has-background" style="background-color:#ffd2d2">Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"background":"#ffe3e3"}}} -->
<p class="has-background" style="background-color:#ffe3e3">Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`);

		cy.getBlock('core/paragraph').last().click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Group').click();

		cy.getByDataTest('style-variations-button-label').should(
			'have.text',
			'Style 2'
		);
	});
});

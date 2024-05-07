/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '../../../../../../cypress/helpers';

describe('Social Links Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(`<!-- wp:social-links {"showLabels":true,"size":"has-normal-icon-size","className":"is-style-default","layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<ul class="wp-block-social-links has-normal-icon-size has-visible-labels is-style-default"><!-- wp:social-link {"url":"#test","service":"wordpress"} /-->

<!-- wp:social-link {"url":"#test","service":"dribbble"} /-->

<!-- wp:social-link {"url":"#test","service":"behance"} /--></ul>
<!-- /wp:social-links -->`);

		// Select target block
		cy.getBlock('core/social-links').click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Social Icons').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Buttons Customize').should('exist');
				cy.getByAriaLabel('Buttons Icons Customize').should('exist');
				cy.getByAriaLabel('Buttons Names Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});

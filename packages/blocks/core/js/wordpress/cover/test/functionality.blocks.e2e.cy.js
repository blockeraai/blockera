/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	openInnerBlocksExtension,
	savePage,
	redirectToFrontPage,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Cover Block → Functionality + Inner blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:cover {"url":"https://placehold.co/600x400","id":60,"dimRatio":50,"customOverlayColor":"#4658a9","layout":{"type":"constrained"}} -->
<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-background-dim" style="background-color:#4658a9"></span><img class="wp-block-cover__image-background wp-image-60" alt="" src="https://placehold.co/600x400" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","placeholder":"Write title…","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Paragraph text here...</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->`);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select Cover').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/cover').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/cover').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Paragraph inner block
		//
		setInnerBlock('core/paragraph');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/paragraph').should(
			'have.css',
			'background-color',
			'rgb(204, 204, 204)'
		);

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-cover').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-cover').within(() => {
			cy.get('p')
				.first()
				.should('have.css', 'background-color', 'rgb(204, 204, 204)');
		});
	});
});

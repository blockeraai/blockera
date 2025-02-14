/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Buttons Block → Functionality + Inner blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 1</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 2</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`);

		cy.getBlock('core/button').first().click();

		cy.getByAriaLabel('Select Buttons').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/buttons').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/buttons').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Button inner block
		//
		setInnerBlock('core/button');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/button')
			.first()
			.within(() => {
				cy.get('.wp-element-button').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);
			});

		//
		// 1.1.2. Text color
		//
		cy.setColorControlValue('Text Color', 'efefef');

		cy.getBlock('core/button')
			.first()
			.within(() => {
				cy.get('.wp-element-button').should(
					'have.css',
					'color',
					'rgb(239, 239, 239)'
				);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-buttons').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-buttons').within(() => {
			// bg color
			cy.get('.wp-element-button')
				.first()
				.should('have.css', 'background-color', 'rgb(204, 204, 204)');

			// text color
			cy.get('.wp-element-button')
				.first()
				.should('have.css', 'color', 'rgb(239, 239, 239)');
		});
	});
});

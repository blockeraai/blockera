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

describe('Buttons Block → Inner Blocks', () => {
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

		cy.getByAriaLabel('Select Buttons').click();

		//
		// 1. Edit Inner Blocks
		//

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

		cy.get('.blockera-block').within(() => {
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

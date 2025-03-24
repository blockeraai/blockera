/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Button Block', () => {
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

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// No inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1. Block Styles
		//

		//
		// 1.1. Clipping
		//
		cy.getBlock('core/button').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/button')
			.first()
			.within(() => {
				cy.get('.wp-element-button').should(
					'have.css',
					'background-clip',
					'padding-box'
				);
			});

		//
		// 1.2. Border Line
		//
		cy.getParentContainer('Border Line').within(() => {
			cy.getByDataTest('border-control-width').clear();
			cy.getByDataTest('border-control-width').type(5, {
				force: true,
			});

			cy.getByDataTest('border-control-color').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[maxlength="9"]').clear({ force: true });
			cy.get('input[maxlength="9"]').type('37e6d4 ');
		});

		cy.getParentContainer('Border Line').within(() => {
			cy.get('[aria-haspopup="listbox"]').click();
			cy.get('div[aria-selected="false"]').eq(1).click();
		});

		// Check block
		// Border should be added to inner element and not to button root tag
		cy.getBlock('core/button')
			.first()
			.should('not.have.css', 'border', '5px dashed rgb(55, 230, 212)');
		cy.getBlock('core/button')
			.first()
			.within(() => {
				cy.get('.wp-element-button').should(
					'have.css',
					'border',
					'5px dashed rgb(55, 230, 212)'
				);
			});

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		// Border should be added to inner element and not to button root tag
		cy.get('.blockera-block.wp-block-button').should(
			'not.have.css',
			'border',
			'5px dashed rgb(55, 230, 212)'
		);

		cy.get('.blockera-block.wp-block-button')
			.first()
			.within(() => {
				cy.get('.wp-element-button')
					.should('have.css', 'background-clip', 'padding-box')
					.should(
						'have.css',
						'border',
						'5px dashed rgb(55, 230, 212)'
					);
			});
	});
});

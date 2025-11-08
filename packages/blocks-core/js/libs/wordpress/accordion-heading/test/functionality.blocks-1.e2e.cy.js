/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setBlockState,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Accordion Heading Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:accordion -->
<div role="group" class="wp-block-accordion"><!-- wp:accordion-item -->
<div class="wp-block-accordion-item"><!-- wp:accordion-heading -->
<h3 class="wp-block-accordion-heading"><button class="wp-block-accordion-heading__toggle"><span class="wp-block-accordion-heading__toggle-title">Accordion 1 title</span><span class="wp-block-accordion-heading__toggle-icon" aria-hidden="true">+</span></button></h3>
<!-- /wp:accordion-heading -->

<!-- wp:accordion-panel -->
<div role="region" class="wp-block-accordion-panel"><!-- wp:paragraph -->
<p>Accordion 1 content</p>
<!-- /wp:paragraph --></div>
<!-- /wp:accordion-panel --></div>
<!-- /wp:accordion-item -->

<!-- wp:accordion-item {"openByDefault":true} -->
<div class="wp-block-accordion-item is-open"><!-- wp:accordion-heading -->
<h3 class="wp-block-accordion-heading"><button class="wp-block-accordion-heading__toggle"><span class="wp-block-accordion-heading__toggle-title">Accordion 2 title</span><span class="wp-block-accordion-heading__toggle-icon" aria-hidden="true">+</span></button></h3>
<!-- /wp:accordion-heading -->

<!-- wp:accordion-panel {"openByDefault":true} -->
<div role="region" class="wp-block-accordion-panel"><!-- wp:paragraph -->
<p>Accordion 2 content</p>
<!-- /wp:paragraph --></div>
<!-- /wp:accordion-panel --></div>
<!-- /wp:accordion-item --></div>
<!-- /wp:accordion -->`);

		cy.getBlock('core/accordion-heading').first().click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover', 'elements/icon']);

		cy.checkBlockStatesPickerItems(
			[
				'states/hover',
				'states/focus',
				'states/focus-within',
				'states/first-child',
				'states/last-child',
				'states/only-child',
				'states/empty',
				'states/before',
				'states/after',
				'elements/bold',
				'elements/italic',
				'elements/kbd',
				'elements/code',
				'elements/span',
				'elements/mark',
				'elements/icon',
			],
			true
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/accordion-heading')
			.first()
			.should('not.have.css', 'background-clip', 'padding-box');

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/accordion-heading')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		//
		// 1.1. elements/icon
		//
		setInnerBlock('elements/icon');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.1.1. Text color
		//
		cy.setColorControlValue('Text Color', '00ffdf');

		cy.getBlock('core/accordion').within(() => {
			cy.get('.wp-block-accordion-heading__toggle-icon')
				.first()
				.should('have.css', 'color', 'rgb(0, 255, 223)');
		});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-accordion-heading')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		cy.get('.wp-block-accordion-heading__toggle-icon')
			.first()
			.should('have.css', 'color', 'rgb(0, 255, 223)');
	});
});

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

describe('Accordion Block', () => {
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

		// Select target block
		cy.getBlock('core/accordion').click();

		cy.getByAriaLabel('Select parent block: Accordion Item').click();

		cy.getByAriaLabel('Select parent block: Accordion').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'elements/items',
			'elements/heading',
			'elements/icon',
			'elements/panel',
		]);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/accordion').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/accordion').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/items
		//
		setInnerBlock('elements/items');

		cy.checkBlockCardItems(['normal', 'hover', 'open', 'close'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('Text Color', 'ff0000');

		cy.getBlock('core/accordion').within(() => {
			cy.get('.wp-block-accordion-item')
				.first()
				.should('have.css', 'color', 'rgb(255, 0, 0)');
		});

		//
		// 1.1.2. Open state
		//
		setBlockState('Open');

		cy.setColorControlValue('BG Color', 'eeff00');

		cy.getBlock('core/accordion').within(() => {
			cy.get('.wp-block-accordion-item')
				.last()
				.should('have.css', 'background-color', 'rgb(238, 255, 0)');
		});

		//
		// 1.1.3. Close state
		//
		setBlockState('Close');

		cy.setColorControlValue('BG Color', 'ffc000');

		cy.getBlock('core/accordion').within(() => {
			cy.get('.wp-block-accordion-item')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 192, 0)');
		});

		//
		// 1.2. elements/heading
		//
		setParentBlock();
		setInnerBlock('elements/heading');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. Text color
		//
		cy.setColorControlValue('Text Color', '00ffdf');

		cy.getBlock('core/accordion').within(() => {
			cy.get('.wp-block-accordion-heading').should(
				'have.css',
				'color',
				'rgb(0, 255, 223)'
			);
		});

		//
		// 1.3. elements/icon
		//
		setParentBlock();
		setInnerBlock('elements/icon');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.3.1. Text color
		//
		cy.setColorControlValue('Text Color', 'b37c16');

		cy.getBlock('core/accordion').within(() => {
			cy.get('.wp-block-accordion-heading__toggle-icon').should(
				'have.css',
				'color',
				'rgb(179, 124, 22)'
			);
		});

		//
		// 1.4. elements/panel
		//
		setInnerBlock('elements/panel');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', '00ff26');

		cy.getBlock('core/accordion').within(() => {
			cy.get('.wp-block-accordion-panel').should(
				'have.css',
				'background-color',
				'rgb(0, 255, 38)'
			);
		});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByDataTest('settings-tab').click();

		// layout settings should be hidden
		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-panel__body-toggle')
				.contains('Layout')
				.should('be.visible');

			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-accordion').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-accordion').within(() => {
			// elements/items
			cy.get('.wp-block-accordion-item')
				.first()
				.should('have.css', 'color', 'rgb(255, 0, 0)');

			// elements/items - close state
			cy.get('.wp-block-accordion-item')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 192, 0)');

			// elements/items - open state
			cy.get('.wp-block-accordion-item')
				.last()
				.should('have.css', 'background-color', 'rgb(238, 255, 0)');

			// elements/heading
			cy.get('.wp-block-accordion-heading').should(
				'have.css',
				'color',
				'rgb(0, 255, 223)'
			);

			// elements/icon
			cy.get('.wp-block-accordion-heading__toggle-icon').should(
				'have.css',
				'color',
				'rgb(179, 124, 22)'
			);

			// elements/panel
			cy.get('.wp-block-accordion-panel').should(
				'have.css',
				'background-color',
				'rgb(0, 255, 38)'
			);
		});
	});
});

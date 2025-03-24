/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setParentBlock,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';
import { experimental } from '@blockera/env';

describe('Column Block', () => {
	beforeEach(() => {
		createPost();
	});

	const enabledOptimizeStyleGeneration = experimental().get(
		'earlyAccessLab.optimizeStyleGeneration'
	);

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Paragraph 1 with <a href="#test">link</a></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">H1</h1>
<!-- /wp:heading -->

<!-- wp:heading -->
<h2 class="wp-block-heading">H2</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">H3</h3>
<!-- /wp:heading -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">H4</h4>
<!-- /wp:heading -->

<!-- wp:heading {"level":5} -->
<h5 class="wp-block-heading">H5</h5>
<!-- /wp:heading -->

<!-- wp:heading {"level":6} -->
<h6 class="wp-block-heading">H6</h6>
<!-- /wp:heading -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button...</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->`);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select Column').click();

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
		cy.getBlock('core/column')
			.first()
			.should('not.have.css', 'background-clip', 'padding-box');

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/column')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

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
		// 1.2. Link inner block
		//
		setParentBlock();
		setInnerBlock('elements/link');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'eeeeee');

		cy.getBlock('core/paragraph')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(238, 238, 238)'
					);
			});

		//
		// 1.3. Headings inner block
		//
		setParentBlock();
		setInnerBlock('core/heading');

		//
		// 1.3.1. Text color
		//
		cy.setColorControlValue('Text Color', 'eeeeee');

		// assert all headings have the same color value
		cy.getBlock('core/heading').each(($item) => {
			cy.wrap($item).should('have.css', 'color', 'rgb(238, 238, 238)');
		});

		//
		// 1.4. H1 inner block
		//
		setParentBlock();
		setInnerBlock('core/heading-1');

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/heading', 'h1').should(
			'have.css',
			'background-color',
			'rgb(255, 0, 0)'
		);

		//
		// 1.5. H2 inner block
		//
		setParentBlock();
		setInnerBlock('core/heading-2');

		//
		// 1.5.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/heading', 'h2').should(
			'have.css',
			'background-color',
			'rgb(255, 32, 32)'
		);

		//
		// 1.6. H3 inner block
		//
		setParentBlock();
		setInnerBlock('core/heading-3');

		//
		// 1.6.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff4040');

		cy.getBlock('core/heading', 'h3').should(
			'have.css',
			'background-color',
			'rgb(255, 64, 64)'
		);

		//
		// 1.7. H4 inner block
		//
		setParentBlock();
		setInnerBlock('core/heading-4');

		//
		// 1.7.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff6060');

		cy.getBlock('core/heading', 'h4').should(
			'have.css',
			'background-color',
			'rgb(255, 96, 96)'
		);

		//
		// 1.8. H5 inner block
		//
		setParentBlock();
		setInnerBlock('core/heading-5');

		//
		// 1.8.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff8080');

		cy.getBlock('core/heading', 'h5').should(
			'have.css',
			'background-color',
			'rgb(255, 128, 128)'
		);

		//
		// 1.9. H6 inner block
		//
		setParentBlock();
		setInnerBlock('core/heading-6');

		//
		// 1.9.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ffaaaa');

		cy.getBlock('core/heading', 'h6').should(
			'have.css',
			'background-color',
			'rgb(255, 170, 170)'
		);

		//
		// 1.10. Button inner block
		//
		setParentBlock();
		setInnerBlock('core/button');

		//
		// 1.10.1. BG color
		//
		cy.setColorControlValue('BG Color', 'eeeeee');

		cy.getBlock('core/button')
			.first()
			.within(() => {
				cy.get('.wp-element-button')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(238, 238, 238)'
					);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-column')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		cy.get('.blockera-block.wp-block-column')
			.first()
			.within(() => {
				// paragraph inner block
				cy.get('p')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);

				// link inner block
				cy.get('p')
					.first()
					.within(() => {
						cy.get('a').should(
							'have.css',
							'background-color',
							'rgb(238, 238, 238)'
						);
					});

				// heading inner block
				['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
					cy.get(tag)
						.first()
						.should('have.css', 'color', 'rgb(238, 238, 238)');
				});

				// h1 inner block
				cy.get('h1')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');

				// h2 inner block
				cy.get('h2')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');

				// h3 inner block
				cy.get('h3')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 64, 64)');

				// h4 inner block
				cy.get('h4')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 96, 96)');

				// h5 inner block
				cy.get('h5')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(255, 128, 128)'
					);

				// h6 inner block
				cy.get('h6')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(255, 170, 170)'
					);

				// button inner block
				cy.get('.wp-element-button')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(238, 238, 238)'
					);
			});
	});

	it('Make sure that the column uses flex-basis for width', () => {
		appendBlocks(`<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Paragraph in column 1</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Paragraph in column 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->`);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select Column').click();

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/column')
			.first()
			.should('have.css', 'flex-basis', '0px');

		cy.getParentContainer('Width').within(() => {
			cy.get('input').type('30%');
		});

		cy.getBlock('core/column')
			.first()
			.should('have.css', 'flex-basis', '30%')
			.should('not.have.css', 'width', '30%');

		const expectedCSS =
			'.blockera-block.wp-block-column[style*=flex-basis]{flex-grow:0';

		//Check block
		cy.get('link#\\@blockera\\/blocks-styles-css')
			.should('exist')
			.then(($link) => {
				// Fetch the CSS file content
				cy.request($link.attr('href')).then((response) => {
					const styleContent = response.body;

					cy.normalizeCSSContent(styleContent).then(
						(normalizedContent) => {
							expect(normalizedContent).to.include(expectedCSS);
						}
					);
				});
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-column')
			.first()
			.should('have.css', 'flex-basis', '30%')
			.should('not.have.css', 'width', '30%');

		if (enabledOptimizeStyleGeneration) {
			cy.get('style#blockera-inline-css')
				.invoke('text')
				.then((styleContent) => {
					cy.normalizeCSSContent(styleContent).then(
						(normalizedContent) => {
							expect(normalizedContent).to.include(expectedCSS);
						}
					);
				});
		}
	});
});

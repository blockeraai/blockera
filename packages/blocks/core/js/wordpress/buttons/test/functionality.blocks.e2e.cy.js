/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
} from '@blockera/dev-cypress/js/helpers';

describe('Buttons Block', () => {
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
		// 1. Edit Block
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

	it('Make sure text decoration is inherited from parent Buttons block', () => {
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
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/buttons').should(
			'not.have.css',
			'text-decoration',
			'overline'
		);

		openMoreFeaturesControl('More typography settings');

		cy.getByAriaLabel('Overline').click();

		// Check block
		cy.getBlock('core/buttons')
			.should('have.css', 'text-decoration')
			.should('include', 'overline');

		cy.getBlock('core/button')
			.first()
			.should('have.css', 'text-decoration')
			.should('include', 'overline');

		cy.getBlock('core/button')
			.first()
			.within(() => {
				cy.get('.wp-element-button')
					.should('have.css', 'text-decoration')
					.should('include', 'overline');
			});

		const expectedCSS = '.wp-block-button__link{text-decoration:inherit;}';

		cy.get('link#\\@blockera\\/blocks-styles-css')
			.should('exist')
			.then(($link) => {
				// Fetch the CSS file content
				cy.request($link.attr('href')).then((response) => {
					const styleContent = response.body;

					cy.normalizeCSSContent(styleContent).then(
						(normalizedContent) => {
							// Function to extract and normalize a specific CSS rule
							const normalizeCSS = (css, selectorPart) => {
								const rules = css.split('}');
								const targetRule = rules.find((rule) =>
									rule.includes(selectorPart)
								);
								if (!targetRule) return '';

								// Split into selectors and declaration
								const [selectors, declaration] =
									targetRule.split('{');

								// Only include selectors that contain 'wp-block-buttons'
								const normalizedSelectors = selectors
									.split(',')
									.map((s) => s.trim())
									.filter((s) =>
										s.includes('wp-block-buttons')
									)
									.sort()
									.join(',');

								// Normalize declaration: remove trailing semicolon and trim
								const normalizedDeclaration = declaration
									.trim()
									.replace(/;$/, '')
									.trim();

								return `${normalizedSelectors}{${normalizedDeclaration}}`;
							};

							const buttonRule = normalizeCSS(
								normalizedContent,
								'wp-block-buttons'
							);
							const expectedRule = normalizeCSS(
								expectedCSS,
								'wp-block-buttons'
							);

							expect(buttonRule).to.equal(expectedRule);
						}
					);
				});
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-buttons')
			.should('have.css', 'text-decoration')
			.should('include', 'overline');

		cy.get('.blockera-block.wp-block-buttons').within(() => {
			// text decoration
			cy.get('.wp-block-button')
				.first()
				.should('have.css', 'text-decoration')
				.should('include', 'overline');

			cy.get('.wp-element-button')
				.first()
				.should('have.css', 'text-decoration')
				.should('include', 'overline');
		});

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.then((styleContent) => {
				cy.normalizeCSSContent(styleContent).then(
					(normalizedContent) => {
						// Split the expected and actual CSS into individual rules and sort them
						const normalizeRules = (css) => {
							return css
								.split('}')
								.map((rule) => rule.trim())
								.filter((rule) => rule)
								.sort()
								.join('}');
						};

						const normalizedExpected = normalizeRules(expectedCSS);
						const normalizedActual =
							normalizeRules(normalizedContent);

						expect(normalizedActual).to.include(normalizedExpected);
					}
				);
			});
	});
});

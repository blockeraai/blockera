/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Details Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence', () => {
		appendBlocks(`<!-- wp:details -->
<details class="wp-block-details"><summary>test title</summary><!-- wp:paragraph {"placeholder":"Type / to add a hidden block"} -->
<p>Paragraph text...</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->`);

		// Select target block
		cy.getBlock('core/details').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/item
		//
		setInnerBlock('elements/title');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/details')
			.first()
			.within(() => {
				cy.get('summary')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/title-cion
		//
		setParentBlock();
		setInnerBlock('elements/title-icon');

		//
		// 1.2.1. Text color
		//
		cy.setColorControlValue('Text Color', '00ffdf');

		cy.getBlock('core/details')
			.first()
			.within(() => {
				cy.get('summary')
					.first()
					.within(($el) => {
						cy.window().then((win) => {
							const marker = win.getComputedStyle(
								$el[0],
								'::marker'
							);
							const markerColor =
								marker.getPropertyValue('color');
							expect(markerColor).to.equal('rgb(0, 255, 223)');
						});
					});
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-details').within(() => {
			// elements/title
			cy.get('summary')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/title-icon
			cy.get('summary')
				.first()
				.within(($el) => {
					cy.window().then((win) => {
						const marker = win.getComputedStyle($el[0], '::marker');
						const markerColor = marker.getPropertyValue('color');
						expect(markerColor).to.equal('rgb(0, 255, 223)');
					});
				});
		});
	});
});

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

describe('List Item Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in block editor and front-end', () => {
		appendBlocks(`<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>item 1 <a href="#">link is here</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 3</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->`);

		// Select target block
		cy.getBlock('core/list-item').first().click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/item-marker
		//
		setInnerBlock('elements/item-marker');

		//
		// 1.1.1. Text color
		//
		cy.setColorControlValue('Text Color', '00ffdf');

		cy.getBlock('core/list')
			.first()
			.within(() => {
				cy.get('li')
					.first()
					.within(($el) => {
						cy.wait(2000);

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
		// 1.2. elements/link
		//
		setParentBlock();
		setInnerBlock('elements/link');

		//
		// 1.2.1. Text color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/list')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-list').within(() => {
			// elements/link
			cy.get('li.blockera-block a')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');

			// elements/item-marker
			cy.get('li.blockera-block')
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

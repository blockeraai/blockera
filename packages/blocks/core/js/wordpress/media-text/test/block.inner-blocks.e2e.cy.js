/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Media Text Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks(`<!-- wp:media-text {"mediaId":60,"mediaLink":"https://placehold.co/600x400","mediaType":"image","mediaWidth":38} -->
<div class="wp-block-media-text is-stacked-on-mobile" style="grid-template-columns:38% auto"><figure class="wp-block-media-text__media"><img src="https://placehold.co/600x400" alt="" class="wp-image-60 size-full"/></figure><div class="wp-block-media-text__content"><!-- wp:paragraph {"placeholder":"Content…"} -->
<p>Paragraph text</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:media-text --> `);

		// Select target block
		cy.getBlock('core/media-text').click();

		cy.getByAriaLabel('Select parent block: Media & Text').click();

		//
		// 1. Inner blocks existence
		//

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByDataTest('elements/link').should('exist');
				cy.getByDataTest('core/paragraph').should('exist');
				cy.getByDataTest('core/heading').should('exist');
				cy.getByDataTest('core/image').should('exist');

				// no other item
				cy.getByDataTest('core/heading-1').should('not.exist');
			}
		);

		//
		// 2. Edit Inner Blocks
		//

		//
		// 2.1. Image inner block
		//
		setInnerBlock('core/image');

		//
		// 2.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/media-text')
			.first()
			.within(() => {
				cy.get('.wp-block-media-text__media > img')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// No need to test other inner blocks because all of them have best tested in column block
		//

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
			// image inner block
			cy.get('.wp-block-media-text__media > img')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});

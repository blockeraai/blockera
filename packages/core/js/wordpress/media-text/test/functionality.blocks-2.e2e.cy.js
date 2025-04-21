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

describe('Media Text Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:media-text {"mediaId":60,"mediaLink":"https://placehold.co/600x400","mediaType":"image","mediaWidth":38} -->
<div class="wp-block-media-text is-stacked-on-mobile" style="grid-template-columns:38% auto"><figure class="wp-block-media-text__media"><img src="https://placehold.co/600x400" alt="" class="wp-image-60 size-full"/></figure><div class="wp-block-media-text__content"><!-- wp:paragraph {"placeholder":"Content…"} -->
<p>Paragraph text</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:media-text --> `);

		// Select target block
		cy.getBlock('core/media-text').click();

		cy.getByAriaLabel('Select parent block: Media & Text').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

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
		// 2. Edit Block
		//

		//
		// 2.0. Block Styles
		//
		cy.getBlock('core/media-text').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/media-text').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

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

		cy.get('.blockera-block.wp-block-media-text').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-media-text').within(() => {
			// image inner block
			cy.get('.wp-block-media-text__media > img')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});

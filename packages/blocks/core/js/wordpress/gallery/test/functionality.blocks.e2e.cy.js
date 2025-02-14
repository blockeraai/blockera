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

describe('Gallery Block → Functionality + Inner blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(
			`<!-- wp:gallery {"linkTo":"none"} -->
<figure class="wp-block-gallery has-nested-images columns-default is-cropped"><!-- wp:image {"id":7144,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-7144"/><figcaption class="wp-element-caption">Image 1 caption</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":7139,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-7139"/><figcaption class="wp-element-caption">Image 2 caption</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":7123,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-7123"/></figure>
<!-- /wp:image --><figcaption class="blocks-gallery-caption wp-element-caption">Gallery caption...</figcaption></figure>
<!-- /wp:gallery -->
			`
		);

		// Select target block
		cy.getBlock('core/image').first().click();

		cy.getByAriaLabel('Select Gallery').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/gallery').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/gallery').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Image inner block
		//
		setInnerBlock('core/image');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/gallery')
			.first()
			.within(() => {
				cy.get('.wp-block-image img')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. Image caption inner block
		//
		setParentBlock();
		setInnerBlock('elements/image-caption');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/gallery')
			.first()
			.within(() => {
				cy.get('.wp-block-image figcaption')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			});

		//
		// 1.3. Gallery caption inner block
		//
		setParentBlock();
		setInnerBlock('elements/gallery-caption');

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff4040');

		cy.getBlock('core/gallery')
			.first()
			.within(() => {
				cy.get('> figcaption')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 64, 64)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-gallery').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-gallery').within(() => {
			// image inner block
			cy.get('.wp-block-image img')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// image caption inner block
			cy.get('.wp-block-image figcaption')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');

			// gallery caption inner block
			cy.get('> figcaption')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 64, 64)');
		});
	});
});

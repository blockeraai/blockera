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

describe('Image Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:image {"id":7139,"width":"406px","height":"auto","aspectRatio":"1","sizeSlug":"full","linkDestination":"custom"} -->
<figure class="wp-block-image size-full is-resized"><a href="https://placehold.co/600x400"><img src="https://placehold.co/600x400" alt="this is the test
" class="wp-image-7139" style="aspect-ratio:1;width:406px;height:auto"/></a><figcaption class="wp-element-caption">Image caption is here...</figcaption></figure>
<!-- /wp:image -->
		`);

		// Select target block
		cy.getBlock('core/image').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover', 'elements/caption']);

		cy.get('.blockera-extension-block-card.master-block-card').within(
			() => {
				cy.get('button[data-test="back-to-parent-navigation"]').should(
					'not.exist'
				);
			}
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/image').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/image').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Image caption inner block
		//
		setInnerBlock('elements/caption');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/image')
			.first()
			.within(() => {
				cy.get('figcaption').should(
					'have.css',
					'background-color',
					'rgb(255, 0, 0)'
				);
			});

		//
		// 1.2. Image link inner block
		//
		setParentBlock();
		setInnerBlock('elements/link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/image')
			.first()
			.within(() => {
				cy.get('a').should(
					'have.css',
					'background-color',
					'rgb(255, 0, 0)'
				);
			});

		//
		// 1.3. Image img/svg tag inner block
		//
		setParentBlock();
		setInnerBlock('elements/img-tag');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', '59ff00');

		cy.getBlock('core/image')
			.first()
			.within(() => {
				cy.get('img').should(
					'have.css',
					'background-color',
					'rgb(89, 255, 0)'
				);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-image')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		cy.get('.blockera-block.wp-block-image').within(() => {
			// caption inner block
			cy.get('figcaption')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// link inner block
			cy.get('a')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// img/svg tag inner block
			cy.get('img')
				.first()
				.should('have.css', 'background-color', 'rgb(89, 255, 0)');
		});
	});

	it('Parent navigation inside gallery', () => {
		appendBlocks(
			`<!-- wp:gallery {"linkTo":"none"} -->
<figure class="wp-block-gallery has-nested-images columns-default is-cropped"><!-- wp:image {"id":7144,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-7144"/><figcaption class="wp-element-caption">Image 1 caption</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":7139,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-7139"/><figcaption class="wp-element-caption">Image 2 caption</figcaption></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery -->`
		);

		cy.getBlock('core/image').first().click();

		cy.get('.blockera-extension-block-card.master-block-card').within(
			() => {
				cy.get('button[data-test="back-to-parent-navigation"]').should(
					'be.visible'
				);
			}
		);
	});
});

/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Image Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks(`<!-- wp:image {"id":7139,"width":"706px","height":"auto","aspectRatio":"1","sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full is-resized"><img src="https://placehold.co/600x400" alt="this is the test
" class="wp-image-7139" style="aspect-ratio:1;width:706px;height:auto"/><figcaption class="wp-element-caption">Image caption is here...</figcaption></figure>
<!-- /wp:image -->
		`);

		// Select target block
		cy.getBlock('core/image').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. Image caption inner block
		//
		setInnerBlock('elements/caption');

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
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
			// caption inner block
			cy.get('figcaption')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});

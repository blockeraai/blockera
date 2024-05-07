/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '../../../../../../cypress/helpers';

describe('Image Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(`
		<!-- wp:image {"id":7139,"width":"706px","height":"auto","aspectRatio":"1","sizeSlug":"full","linkDestination":"none","className":"blockera-core-block blockera-core-block-2eb6d5e7-9ffb-4b90-9f95-1d52c573e9e2","blockeraFlexWrap":{"reverse":false},"blockeraPropsId":"478293488","blockeraCompatId":"478293488"} -->
<figure class="wp-block-image size-full is-resized blockera-core-block blockera-core-block-2eb6d5e7-9ffb-4b90-9f95-1d52c573e9e2"><img src="https://placehold.co/600x400" alt="this is the test
" class="wp-image-7139" style="aspect-ratio:1;width:706px;height:auto"/><figcaption class="wp-element-caption">Test caption is here...</figcaption></figure>
<!-- /wp:image -->
		`);

		// Select target block
		cy.getBlock('core/image').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Caption Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});

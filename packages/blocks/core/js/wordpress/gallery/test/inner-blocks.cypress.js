/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '@blockera/dev-cypress/js/helpers';

describe('Gallery Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(
			`<!-- wp:gallery {"linkTo":"none"} -->
<figure class="wp-block-gallery has-nested-images columns-default is-cropped"><!-- wp:image {"id":7144,"sizeSlug":"large","linkDestination":"none","className":"blockera-block blockera-block-0e1eb5b2-0332-49c4-8ab7-d6da3510191d","blockeraFlexWrap":{"reverse":false},"blockeraPropsId":"47111938578","blockeraCompatId":"47111938578"} -->
<figure class="wp-block-image size-large blockera-block blockera-block-0e1eb5b2-0332-49c4-8ab7-d6da3510191d"><img src="https://placehold.co/600x400" alt="" class="wp-image-7144"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":7139,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://placehold.co/600x400" alt="" class="wp-image-7139"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":7123,"sizeSlug":"large","linkDestination":"none","className":"blockera-block blockera-block-4df1fe55-0eae-4065-b060-4675d2c0304a","blockeraFlexWrap":{"reverse":false},"blockeraPropsId":"47112011175","blockeraCompatId":"47112011175"} -->
<figure class="wp-block-image size-large blockera-block blockera-block-4df1fe55-0eae-4065-b060-4675d2c0304a"><img src="https://placehold.co/600x400" alt="" class="wp-image-7123"/><figcaption class="wp-element-caption">Image test caption</figcaption></figure>
<!-- /wp:image --><figcaption class="blocks-gallery-caption wp-element-caption">Gallery test caption...</figcaption></figure>
<!-- /wp:gallery -->
			`
		);

		// Select target block
		cy.getBlock('core/image').click();

		cy.getByAriaLabel('Select Gallery').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Gallery Caption Customize').should('exist');
				cy.getByAriaLabel('Images Customize').should('exist');
				cy.getByAriaLabel('Images Captions Customize').should('exist');

				cy.getByAriaLabel('H1s Customize').should('not.exist');
			}
		);
	});
});

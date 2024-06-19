/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '@blockera/dev-cypress/js/helpers';

describe('Video Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:video -->
<figure class="wp-block-video"></figure>
<!-- /wp:video -->`);

		cy.getBlock('core/video').click();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);
	});
});

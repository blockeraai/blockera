/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Featured Image Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:post-featured-image /-->`);

		cy.getBlock('core/post-featured-image').click();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);
	});
});

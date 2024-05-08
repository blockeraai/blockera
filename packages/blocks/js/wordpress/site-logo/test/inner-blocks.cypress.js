/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '@blockera/dev-cypress/js/helpers';

describe('Site Logo Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:site-logo /-->`);

		cy.getBlock('core/site-logo').click();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);
	});
});

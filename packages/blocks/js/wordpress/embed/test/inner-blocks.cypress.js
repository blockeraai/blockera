/**
 * Cypress dependencies
 */
import { appendBlocks, createPost } from '../../../../../../cypress/helpers';

describe('Embed Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:embed /-->`);

		cy.getBlock('core/embed').first().click();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);
	});
});

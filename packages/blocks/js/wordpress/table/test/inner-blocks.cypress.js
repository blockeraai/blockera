/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Table Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:table -->
<figure class="wp-block-table"><table><tbody><tr><td>cell 1</td><td>cell 2</td></tr><tr><td>cell 3</td><td>cell 4</td></tr></tbody></table><figcaption class="wp-element-caption">caption text...</figcaption></figure>
<!-- /wp:table -->`);

		cy.getBlock('core/table').click();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);
	});
});

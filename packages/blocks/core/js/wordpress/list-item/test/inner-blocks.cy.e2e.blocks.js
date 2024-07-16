/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('List Item Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should not have inner blocks', () => {
		appendBlocks(
			'<!-- wp:list -->\n' +
				'<ul><!-- wp:list-item -->\n' +
				'<li>item 1</li>\n' +
				'<!-- /wp:list-item -->\n' +
				'' +
				'<!-- wp:list-item -->\n' +
				'<li>item 2</li>\n' +
				'<!-- /wp:list-item -->\n' +
				'' +
				'<!-- wp:list-item -->\n' +
				'<li>item 3</li>\n' +
				'<!-- /wp:list-item --></ul>\n' +
				'<!-- /wp:list -->'
		);

		// Select target block
		cy.getBlock('core/list').click();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);
	});
});

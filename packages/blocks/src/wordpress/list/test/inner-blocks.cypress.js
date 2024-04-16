/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '../../../../../../cypress/helpers';

describe('List Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
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

		// Switch to parent block
		cy.getByAriaLabel('Select List').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.publisher-extension.publisher-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Links Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Buttons Customize').should('not.exist');
			}
		);
	});
});

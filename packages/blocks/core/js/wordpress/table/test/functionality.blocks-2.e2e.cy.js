/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Table Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:table -->
<figure class="wp-block-table"><table><tbody><tr><td>cell 1</td><td>cell 2</td></tr><tr><td>cell 3</td><td>cell 4</td></tr></tbody></table><figcaption class="wp-element-caption">caption text...</figcaption></figure>
<!-- /wp:table -->`);

		cy.getBlock('core/table').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// No inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/table').within(() => {
			cy.get('table').should('have.css', 'background-clip', 'border-box');
		});

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/table').within(() => {
			cy.get('table').should(
				'have.css',
				'background-clip',
				'padding-box'
			);
		});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-table table').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});

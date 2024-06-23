/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Categories Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(`
		<!-- wp:categories {"className":"blockera-block blockera-block-643cb3c4-396b-4baa-bf5f-7033c6462ca7","blockeraFlexWrap":{"reverse":false},"blockeraPropsId":"4784211580","blockeraCompatId":"4784211581"} /-->
		`);

		// Select target block
		cy.getBlock('core/categories').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Link Customize').should('exist');
				cy.getByAriaLabel('Link Parent Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});

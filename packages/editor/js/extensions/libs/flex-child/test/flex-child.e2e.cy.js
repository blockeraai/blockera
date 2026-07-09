import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	appendBlocks,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Flex Child', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Is not child of a flex container', () => {
		beforeEach(() => {
			const code = `<!-- wp:paragraph -->
<p>This is a test text.</p>
<!-- /wp:paragraph -->`;

			appendBlocks(code);

			cy.getBlock('core/paragraph').click();
			cy.getByDataTest('style-tab').click();
		});

		it('should not have flex-child block section, if parents display is not flex', () => {
			cy.contains('Flex Child').should('not.exist');
		});
	});

	describe('Is child of a flex container', () => {
		beforeEach(() => {
			const code = `<!-- wp:group {"metadata":{"name":"Flex Container"},"blockeraPropsId":"3f915dbf-73b0-49a8-9409-b81a5c55aedd","blockeraCompatId":"918123345376","blockeraDisplay":{"value":"flex"},"className":"blockera-block blockera-block\u002d\u002d7to0gs","layout":{"type":"flex"}} -->
<div class="wp-block-group blockera-block blockera-block--7to0gs"><!-- wp:paragraph {"blockeraPropsId":"8d3e3db6-a502-4fed-8392-1dcd0ad8a28d","blockeraCompatId":"917125625523","className":"blockera-block blockera-block-94ppkx"} -->
<p class="blockera-block blockera-block-94ppkx">test paragraph...</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;

			appendBlocks(code);

			cy.getBlock('core/paragraph').click();
			cy.getByDataTest('style-tab').click();
		});

		it('should have flex-child block section', () => {
			cy.contains('Flex Child').should('exist');
		});
	});
});

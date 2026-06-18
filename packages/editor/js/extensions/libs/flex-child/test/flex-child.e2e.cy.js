import {
	createPost,
	appendBlocks,
	setDeviceType,
	setInnerBlock,
	setParentBlock,
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
			cy.getByAriaControls('styles-view').click();
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
			cy.getByAriaControls('styles-view').click();
		});

		it('should have flex-child block section - 1', () => {
			// Group block should not have the flex child block section
			cy.getBlock('core/group').click();
			cy.getByAriaControls('styles-view').click();
			cy.contains('Flex Child').should('not.exist');

			// Wait for the block to be updated
			cy.wait(200);

			// Paragraph block should have the flex child block section
			cy.getBlock('core/paragraph').click();
			cy.getByAriaControls('styles-view').click();
			cy.contains('Flex Child').should('exist');

			// Wait for the block to be updated
			cy.wait(200);

			// Switch to tablet device
			setDeviceType('Mobile Portrait');
			cy.getBlock('core/group').click();
			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Block').click();
			});

			// Wait for the block to be updated
			cy.wait(200);

			cy.getBlock('core/paragraph').click();
			cy.getByAriaControls('styles-view').click();
			cy.contains('Flex Child').should('not.exist');

			// Wait for the block to be updated
			cy.wait(200);

			// Flex child should exist on desktop device
			setDeviceType('Desktop');

			// Switch blocks multiple times to make sure the flex child block section is not lost
			cy.getBlock('core/group').click();
			cy.getBlock('core/paragraph').click();
			cy.getBlock('core/group').click();

			// Wait for the block to be updated
			cy.wait(200);

			cy.getBlock('core/paragraph').click();
			cy.getByAriaControls('styles-view').click();
			cy.contains('Flex Child').should('exist');
		});

		it('should have flex-child block section - 2', () => {
			cy.contains('Flex Child').should('exist');

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			// Check inner block to make sure it has the flex child block section
			setInnerBlock('elements/bold');
			cy.contains('Flex Child').should('exist');

			// Switch back to the parent block
			setParentBlock();
			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Block').click();
			});

			// Check inner block to make sure it does not have the flex child block section
			setInnerBlock('elements/bold');
			cy.contains('Flex Child').should('not.exist');
		});
	});
});

/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	setInnerBlock,
	setBlockState,
	addBlockState,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Display → WP Data Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Group Block', () => {
		it('Constrained value', () => {
			appendBlocks(`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

			cy.getBlock('core/heading').first().click();

			cy.getByAriaLabel('Select Group').click();

			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				expect('constrained').to.be.equal(
					getSelectedBlock(data, 'layout')?.type
				);

				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraDisplay')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			getWPDataObject().then((data) => {
				expect('flex').to.be.equal(
					getSelectedBlock(data, 'layout')?.type
				);

				expect('flex').to.be.equal(
					getSelectedBlock(data, 'blockeraDisplay')
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// deselect
			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			getWPDataObject().then((data) => {
				// default value for display in Group block is 'constrained'
				expect('constrained').to.be.equal(
					getSelectedBlock(data, 'layout')?.type
				);

				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraDisplay')
				);
			});
		});

		it('Flex value', () => {
			appendBlocks(`<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

			cy.getBlock('core/heading').first().click();

			cy.getByAriaLabel('Select Row').click();

			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				expect('flex').to.be.equal(
					getSelectedBlock(data, 'layout')?.type
				);

				expect('flex').to.be.equal(
					getSelectedBlock(data, 'blockeraDisplay')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			getWPDataObject().then((data) => {
				// default value for display in Group block is 'constrained'
				expect('constrained').to.be.equal(
					getSelectedBlock(data, 'layout')?.type
				);

				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraDisplay')
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// deselect
			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			getWPDataObject().then((data) => {
				expect('flex').to.be.equal(
					getSelectedBlock(data, 'layout')?.type
				);

				expect('flex').to.be.equal(
					getSelectedBlock(data, 'blockeraDisplay')
				);
			});
		});
	});

	describe('Buttons Block', () => {
		it('Flex vertical', () => {
			appendBlocks(`<!-- wp:buttons {"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Button 1</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Button 2</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->
		`);

			// Select target block
			cy.getBlock('core/buttons').first().click();

			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				expect('flex').to.be.equal(
					getSelectedBlock(data, 'layout')?.type
				);

				expect('flex').to.be.equal(
					getSelectedBlock(data, 'blockeraDisplay')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			getWPDataObject().then((data) => {
				// default display value for buttons is "flex"
				expect('flex').to.be.equal(
					getSelectedBlock(data, 'layout')?.type
				);

				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraDisplay')
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			getWPDataObject().then((data) => {
				expect('flex').to.be.equal(
					getSelectedBlock(data, 'layout')?.type
				);

				expect('flex').to.be.equal(
					getSelectedBlock(data, 'blockeraDisplay')
				);
			});
		});
	});
});

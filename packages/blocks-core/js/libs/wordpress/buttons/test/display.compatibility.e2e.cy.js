/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	setInnerBlock,
	setBlockState,
	addBlockState,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Buttons Block → Display → WP Data Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('No Flex Value', () => {
		appendBlocks(`<!-- wp:buttons -->
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
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByAriaLabel('Column').click();
		});

		getWPDataObject().then((data) => {
			// default display value for buttons is "flex"
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('column').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));
		});
	});

	it('Flex Horizontal', () => {
		appendBlocks(`<!-- wp:buttons {"layout":{"type":"flex","orientation":"horizontal"}} -->
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
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByAriaLabel('Column').click();
		});

		getWPDataObject().then((data) => {
			// default display value for buttons is "flex"
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('column').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));
		});
	});

	it('Flex Vertical', () => {
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
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('column').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByAriaLabel('Row').click();
		});

		getWPDataObject().then((data) => {
			// default display value for buttons is "flex"
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));
		});
	});
});

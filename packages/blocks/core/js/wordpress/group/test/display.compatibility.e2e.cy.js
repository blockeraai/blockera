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

describe('Group Block → Display → WP Data Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

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

		cy.checkActiveBlockVariation('group');

		//
		// Test 1: WP data to Blockera
		//

		getWPDataObject().then((data) => {
			expect('constrained').to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));
		});

		//
		// Test 2: Blockera value to WP data
		//

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

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

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));
		});
	});

	it('Flex Value (Row)', () => {
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

		cy.getByAriaLabel('Select parent block: Row').click();

		cy.checkActiveBlockVariation('group-row');

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

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Grid').click();
		});

		cy.checkActiveBlockVariation('group-grid');

		getWPDataObject().then((data) => {
			expect('grid').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('grid').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		// reselect
		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Grid').click();
		});

		getWPDataObject().then((data) => {
			// default value for display in Group block is 'constrained'
			expect('constrained').to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));
		});
	});

	it('Flex Value (Column)', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

		cy.getBlock('core/heading').first().click();

		cy.getByAriaLabel('Select parent block: Stack').click();

		cy.checkActiveBlockVariation('group-stack');

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

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Grid').click();
		});

		cy.checkActiveBlockVariation('group-grid');

		getWPDataObject().then((data) => {
			expect('grid').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('grid').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		// reselect
		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Grid').click();
		});

		getWPDataObject().then((data) => {
			// default value for display in Group block is 'constrained'
			expect('constrained').to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));
		});
	});

	it('Grid Value', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"grid"}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

		cy.getBlock('core/heading').first().click();

		cy.getByAriaLabel('Select parent block: Grid').click();

		cy.checkActiveBlockVariation('group-grid');

		//
		// Test 1: WP data to Blockera
		//

		getWPDataObject().then((data) => {
			expect('grid').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('grid').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});

		cy.checkActiveBlockVariation('group-row');

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		// reselect
		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});

		getWPDataObject().then((data) => {
			// default value for display in Group block is 'constrained'
			expect('constrained').to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));
		});
	});
});

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

const testContent = `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"color":{"background":"#ffd2d2"}}} -->
<p class="has-background" style="background-color:#ffd2d2">Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"background":"#ffe3e3"}}} -->
<p class="has-background" style="background-color:#ffe3e3">Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;

/**
 * We need to make sure while changing the variation or display, the 2 way compatibility works correctly.
 */
describe('Group Block → Variation Switch Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Variation Switch (`From WP` Compatibility)', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Group').click();

		//
		// Test 1: WP data to Blockera
		//
		getWPDataObject().then((data) => {
			expect('constrained').to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		// assert current variation
		cy.checkActiveBlockVariation('group');

		//
		// Test 2: Change Variation to `group-row`
		//

		cy.setBlockVariation('group-row');

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		//
		// Test 3: Change Variation to `group-stack`
		//

		cy.setBlockVariation('group-stack');

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('column').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		//
		// Test 4: Change Variation to `group-grid`
		//

		cy.setBlockVariation('group-grid');

		getWPDataObject().then((data) => {
			expect('grid').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('grid').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			// it remains from previous action (group-stack)
			expect('column').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		//
		// Test 5: Change Variation to `group`
		//

		cy.setBlockVariation('group');

		getWPDataObject().then((data) => {
			expect('constrained').to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));

			// it remains from previous action (group-stack)
			expect('column').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});
	});

	it('Variation Switch (`To WP` Compatibility)', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Group').click();

		//
		// Test 1: WP data to Blockera
		//
		getWPDataObject().then((data) => {
			expect('constrained').to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		// assert current variation
		cy.checkActiveBlockVariation('group');

		//
		// Test 2: Change to `Flex` & `Row` direction - Variation should change to `group-row`
		//

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByAriaLabel('Row').click();
		});

		// assert current variation
		cy.checkActiveBlockVariation('group-row');

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		//
		// Test 3: Change to `Flex` & `Column` direction - Variation should change to `group-stack`
		//

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByAriaLabel('Column').click();
		});

		cy.checkActiveBlockVariation('group-stack');

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('column').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		//
		// Test 4: Change to `Flex` & `Row` direction again - Variation should change to `group-row`
		//

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByAriaLabel('Row').click();
		});

		cy.checkActiveBlockVariation('group-row');

		getWPDataObject().then((data) => {
			expect('flex').to.be.equal(getSelectedBlock(data, 'layout')?.type);

			expect('flex').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		//
		// Test 4: Change to `Grid` - Variation should change to `group-grid`
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

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		//
		// Test 5: Change to `inline-block` - Variation should change to `group`
		//

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Inline Block').click();
		});

		cy.checkActiveBlockVariation('group');

		getWPDataObject().then((data) => {
			expect('constrained').to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('inline-block').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		//
		// Test 6: Change to `flex` and then to `block` - Variation should change to `group`
		//

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
			cy.getByAriaLabel('Block').click();
		});

		cy.checkActiveBlockVariation('group');

		getWPDataObject().then((data) => {
			expect('constrained').to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('block').to.be.equal(
				getSelectedBlock(data, 'blockeraDisplay')
			);

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});

		//
		// Test 7: Unselect display - Variation should change to `group`
		//

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Block').click();
		});

		cy.checkActiveBlockVariation('group');

		getWPDataObject().then((data) => {
			expect('constrained').to.be.equal(
				getSelectedBlock(data, 'layout')?.type
			);

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraDisplay'));

			expect('row').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.direction
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
			);

			expect('').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
			);
		});
	});

	it('Resetting Display feature to make sure variation changes', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Group').click();

		// assert current variation
		cy.checkActiveBlockVariation('group');

		//
		// Change to Display to change variation then reset the display to return the variation to `group`
		//
		['Block', 'Flex', 'Grid', 'Inline Block', 'Inline', 'None'].forEach(
			(item) => {
				// change to new display
				cy.getParentContainer('Display').within(() => {
					cy.getByAriaLabel(item).click();
				});

				if (item === 'Flex') {
					cy.getParentContainer('Flex Layout').within(() => {
						cy.getByAriaLabel('Row').click();
					});
				}

				// reset display
				cy.resetBlockeraAttribute('Layout', 'Display', 'reset');

				// assert current variation
				cy.checkActiveBlockVariation('group');

				getWPDataObject().then((data) => {
					expect('constrained').to.be.equal(
						getSelectedBlock(data, 'layout')?.type
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'blockeraDisplay')
					);

					expect('row').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexLayout')?.direction
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexLayout')
							?.justifyContent
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
					);
				});
			}
		);
	});
});

/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Flex Wrap → WP Data Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Nowrap value', () => {
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
			expect('nowrap').to.be.equal(
				getSelectedBlock(data, 'layout')?.flexWrap
			);

			expect({
				value: 'nowrap',
				reverse: false,
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFlexWrap'));
		});

		//
		// Test 2: Blockera value to WP data
		//

		cy.getParentContainer('Children Wrap').within(() => {
			cy.getByAriaLabel('Wrap').click();
		});

		getWPDataObject().then((data) => {
			expect('wrap').to.be.equal(
				getSelectedBlock(data, 'layout')?.flexWrap
			);

			expect({
				value: 'wrap',
				reverse: false,
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFlexWrap'));
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		// deselect
		cy.getParentContainer('Children Wrap').within(() => {
			cy.getByAriaLabel('Wrap').click();
		});

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'layout')?.flexWrap
			);

			expect({
				value: '',
				reverse: false,
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFlexWrap'));
		});
	});
});

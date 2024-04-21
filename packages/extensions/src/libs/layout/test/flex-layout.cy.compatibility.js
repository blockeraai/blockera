/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Flex Layout → WP Data Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Combination of direction, align items and justify content', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"flex","orientation":"vertical","justifyContent":"right","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>test 2</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>test 3</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
					`);

		cy.getBlock('core/paragraph').first().click();

		cy.getByAriaLabel('Select Stack').click();

		//
		// Test 1: WP data to Blockera
		//

		getWPDataObject().then((data) => {
			expect('vertical').to.be.equal(
				getSelectedBlock(data, 'layout')?.orientation
			);

			expect('top').to.be.equal(
				getSelectedBlock(data, 'layout')?.verticalAlignment
			);

			expect('right').to.be.equal(
				getSelectedBlock(data, 'layout')?.justifyContent
			);

			expect({
				direction: 'column',
				alignItems: 'flex-start',
				justifyContent: 'flex-end',
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherFlexLayout'));
		});

		//
		// Test 2: Change direction
		//

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByAriaLabel('Row').click();
		});

		getWPDataObject().then((data) => {
			expect('horizontal').to.be.equal(
				getSelectedBlock(data, 'layout')?.orientation
			);

			expect('top').to.be.equal(
				getSelectedBlock(data, 'layout')?.verticalAlignment
			);

			expect('right').to.be.equal(
				getSelectedBlock(data, 'layout')?.justifyContent
			);

			expect({
				direction: 'row',
				alignItems: 'flex-start',
				justifyContent: 'flex-end',
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherFlexLayout'));
		});

		//
		// Test 3: change align items and justify content
		//

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByDataTest('matrix-center-left-normal').click();
		});

		getWPDataObject().then((data) => {
			expect('horizontal').to.be.equal(
				getSelectedBlock(data, 'layout')?.orientation
			);

			expect('center').to.be.equal(
				getSelectedBlock(data, 'layout')?.verticalAlignment
			);

			expect('left').to.be.equal(
				getSelectedBlock(data, 'layout')?.justifyContent
			);

			expect({
				direction: 'row',
				alignItems: 'center',
				justifyContent: 'flex-start',
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherFlexLayout'));
		});

		//
		// Test 4: Clear Blockera value and check WP data
		//

		// reset to default value
		cy.getByAriaLabel('Flex Layout').click();
		cy.getByAriaLabel('Reset To Default Setting').click();

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'layout')?.orientation
			);

			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'layout')?.verticalAlignment
			);

			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'layout')?.justifyContent
			);

			expect({
				direction: 'row',
				alignItems: '',
				justifyContent: '',
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherFlexLayout'));
		});
	});
});

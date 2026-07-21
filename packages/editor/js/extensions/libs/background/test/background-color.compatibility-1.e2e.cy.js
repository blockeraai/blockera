/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	getSelectedBlock,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers';

describe('Background Color → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"style":{"color":{"background":"#ffdfdf"}}} -->\n' +
					'<p class="has-background" style="background-color:#ffdfdf">Test Paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// add alias to the feature container
			cy.getParentContainer('BG Color').as('bgColorContainer');

			cy.addNewTransition();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('#ffdfdf').to.be.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// open color popover
			cy.setColorControlValue('BG Color', '#666666');

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('#666666').to.be.equal(
					getSelectedBlock(data, 'style')?.color?.background
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear bg color
			cy.clearColorControlValue('BG Color');

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.color?.background
				);
			});

			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
			});
		});

		it('Variable Value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"backgroundColor":"accent-3"} -->\n' +
					'<p class="has-accent-3-background-color has-background">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// add alias to the feature container
			cy.getParentContainer('BG Color').as('bgColorContainer');

			cy.addNewTransition();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					settings: {
						name: 'Accent 3',
						id: 'accent-3',
						value: '#503AA8',
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Five',
						},
						type: 'color',
						var: '--wp--preset--color--accent-3',
					},
					name: 'Accent 3',
					isValueAddon: true,
					valueType: 'variable',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
				expect('accent-3').to.be.equal(
					getSelectedBlock(data, 'backgroundColor')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// open color popover
			cy.get('@bgColorContainer').within(() => {
				cy.clickValueAddonButton();
			});

			// change variable
			cy.selectValueAddonItem('contrast');

			// Check WP data
			getWPDataObject().then((data) => {
				expect('contrast').to.be.equal(
					getSelectedBlock(data, 'backgroundColor')
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// open color popover
			cy.get('@bgColorContainer').within(() => {
				cy.removeValueAddon();
			});

			// Check WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'backgroundColor')
				);

				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
			});
		});

		it('Not found variable', () => {
			appendBlocks(`<!-- wp:paragraph {"backgroundColor":"unknown"} -->
<p class="has-unknown-background-color has-background">Test paragraph</p>
<!-- /wp:paragraph -->`);

			// Select target block
			cy.getBlock('core/paragraph').click();

			cy.addNewTransition();

			cy.getParentContainer('BG Color').as('bgColorContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					settings: {
						name: 'unknown',
						id: 'var:preset|color|unknown',
						value: 'var(--wp--preset--color--unknown)',
						type: 'color',
						var: '--wp--preset--color--unknown',
					},
					name: 'unknown',
					isValueAddon: true,
					valueType: 'variable',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
				expect('unknown').to.be.equal(
					getSelectedBlock(data, 'backgroundColor')
				);
			});

			//
			// Test 2: Check interface for showing deleted value addon
			//

			cy.get('@bgColorContainer').within(() => {
				cy.get('[data-test="value-addon-deleted"]').should('exist');
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			cy.get('@bgColorContainer').within(() => {
				cy.removeValueAddon();
			});

			// Check WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'backgroundColor')
				);

				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
			});
		});
	});
});

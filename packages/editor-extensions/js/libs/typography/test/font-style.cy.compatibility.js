/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Font Style → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('Simple value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic","fontWeight":"400"}}} -->\n' +
					'<p style="font-style:italic;font-weight:400">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Open more settings
			openMoreFeaturesControl('More typography settings');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('italic').to.be.equal(
					getSelectedBlock(data, 'blockeraFontStyle')
				);

				expect('italic').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontStyle
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.getByAriaLabel('Normal style').click();

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('normal').to.be.equal(
					getSelectedBlock(data, 'blockeraFontStyle')
				);

				expect('normal').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontStyle
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear value
			cy.getByAriaLabel('Normal style').click();

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraFontStyle')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontStyle
				);
			});
		});
	});
});

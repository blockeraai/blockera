/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Text Decoration → WP Compatibility', () => {
	describe('Paragraph Block', () => {
		it('Simple value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"style":{"typography":{"textDecoration":"underline"}}} -->\n' +
					'<p style="text-decoration:underline">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Open more settings
			openMoreFeaturesControl('More typography settings');

			cy.getParentContainer('Decoration').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('underline').to.be.equal(
					getSelectedBlock(data, 'publisherTextDecoration')
				);

				expect('underline').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textDecoration
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.get('@container').within(() => {
				cy.getByAriaLabel('Line Through').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('line-through').to.be.equal(
					getSelectedBlock(data, 'publisherTextDecoration')
				);

				expect('line-through').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textDecoration
				);
			});

			cy.get('@container').within(() => {
				cy.getByAriaLabel('Overline').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('overline').to.be.equal(
					getSelectedBlock(data, 'publisherTextDecoration')
				);

				expect('overline').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textDecoration
				);
			});

			cy.get('@container').within(() => {
				cy.getByAriaLabel('None').click();
			});

			// Blockera value should NOT moved to WP data
			getWPDataObject().then((data) => {
				expect('initial').to.be.equal(
					getSelectedBlock(data, 'publisherTextDecoration')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textDecoration
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear value
			cy.get('@container').within(() => {
				cy.getByAriaLabel('None').click();
			});

			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'publisherTextDecoration')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textDecoration
				);
			});
		});
	});
});

/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Text Transform → WP Compatibility', () => {
	describe('Paragraph Block', () => {
		it('Simple value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase"}}} -->\n' +
					'<p style="text-transform:uppercase">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Open more settings
			cy.openMoreFeatures('More typography settings');

			cy.getParentContainer('Capitalize').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('uppercase').to.be.equal(
					getSelectedBlock(data, 'publisherTextTransform')
				);

				expect('uppercase').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textTransform
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			//
			// Capitalize
			//
			cy.get('@container').within(() => {
				cy.get('button[data-value="capitalize"]').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('capitalize').to.be.equal(
					getSelectedBlock(data, 'publisherTextTransform')
				);

				expect('capitalize').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textTransform
				);
			});

			//
			// Lowercase
			//
			cy.get('@container').within(() => {
				cy.get('button[data-value="lowercase"]').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('lowercase').to.be.equal(
					getSelectedBlock(data, 'publisherTextTransform')
				);

				expect('lowercase').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textTransform
				);
			});

			//
			// initial
			//
			cy.get('@container').within(() => {
				cy.get('button[data-value="initial"]').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('initial').to.be.equal(
					getSelectedBlock(data, 'publisherTextTransform')
				);

				expect('initial').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textTransform
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear value
			cy.get('@container').within(() => {
				cy.get('button[data-value="initial"]').click();
			});

			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'publisherTextTransform')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.textTransform
				);
			});
		});
	});
});

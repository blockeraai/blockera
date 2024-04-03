/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Text Orientation → WP Compatibility', () => {
	describe('Paragraph Block', () => {
		it('Horizontal value + all Blockera values', () => {
			appendBlocks(
				'<!-- wp:paragraph {"style":{"typography":{"writingMode":"horizontal-tb"}}} -->\n' +
					'<p style="writing-mode:horizontal-tb">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Open more settings
			cy.openMoreFeatures('More typography settings');

			cy.getParentContainer('Orientation').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('initial').to.be.equal(
					getSelectedBlock(data, 'publisherTextOrientation')
				);

				expect('horizontal-tb').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.writingMode
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			//
			// Style 1
			//
			cy.get('@container').within(() => {
				cy.get('button[data-value="style-1"]').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('style-1').to.be.equal(
					getSelectedBlock(data, 'publisherTextOrientation')
				);

				expect('vertical-rl').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.writingMode
				);
			});

			//
			// Style 2
			//
			cy.get('@container').within(() => {
				cy.get('button[data-value="style-2"]').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('style-2').to.be.equal(
					getSelectedBlock(data, 'publisherTextOrientation')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.writingMode
				);
			});

			//
			// Style 3
			//
			cy.get('@container').within(() => {
				cy.get('button[data-value="style-3"]').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('style-3').to.be.equal(
					getSelectedBlock(data, 'publisherTextOrientation')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.writingMode
				);
			});

			//
			// Style 4
			//
			cy.get('@container').within(() => {
				cy.get('button[data-value="style-4"]').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('style-4').to.be.equal(
					getSelectedBlock(data, 'publisherTextOrientation')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.writingMode
				);
			});

			//
			// Initial
			//
			cy.get('@container').within(() => {
				cy.get('button[data-value="initial"]').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('initial').to.be.equal(
					getSelectedBlock(data, 'publisherTextOrientation')
				);

				expect('horizontal-tb').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.writingMode
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
					getSelectedBlock(data, 'publisherTextOrientation')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.writingMode
				);
			});
		});

		it('Vertical value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"style":{"typography":{"writingMode":"vertical-rl"}}} -->\n' +
					'<p style="writing-mode:vertical-rl">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Open more settings
			cy.openMoreFeatures('More typography settings');

			cy.getParentContainer('Orientation').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('style-1').to.be.equal(
					getSelectedBlock(data, 'publisherTextOrientation')
				);

				expect('vertical-rl').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.writingMode
				);
			});

			//
			// Test 2: Clear Blockera value and check WP data
			//

			// clear value
			cy.get('@container').within(() => {
				cy.get('button[data-value="style-1"]').click();
			});

			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'publisherTextOrientation')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.writingMode
				);
			});
		});
	});
});

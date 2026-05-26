/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Font Appearance → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('Simple value', () => {
			appendBlocks(
				`<!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic","fontWeight":"600"}}} -->
<p style="font-style:italic;font-weight:600">Test paragraph</p>
<!-- /wp:paragraph -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').click();


			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {

				expect('italic').to.be.equal(
					getSelectedBlock(data, 'blockeraFontAppearance')?.style
				);

				expect('italic').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontStyle
				);

				expect('600').to.be.equal(
					getSelectedBlock(data, 'blockeraFontAppearance')?.weight
				);

				expect('600').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontWeight
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.getParentContainer('Appearance').within(() => {
				cy.get('select').select('200-normal');
			});


			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('normal').to.be.equal(
					getSelectedBlock(data, 'blockeraFontAppearance')?.style
				);

				expect('normal').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontStyle
				);

				expect('200').to.be.equal(
					getSelectedBlock(data, 'blockeraFontAppearance')?.weight
				);

				expect('200').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontWeight
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear value
			cy.getParentContainer('Appearance').within(() => {
				cy.get('select').select('');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraFontAppearance')?.style
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontStyle
				);

				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraFontAppearance')?.weight
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontWeight
				);
			});
		});
	});
});

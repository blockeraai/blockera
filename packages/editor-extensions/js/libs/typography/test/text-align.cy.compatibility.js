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

describe('Text Align → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('Simple value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"align":"center"} -->\n' +
					'<p class="has-text-align-center">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Open more settings
			openMoreFeaturesControl('More typography settings');

			cy.getParentContainer('Text Align').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('center').to.be.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);

				expect('center').to.be.equal(getSelectedBlock(data, 'align'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.get('@container').within(() => {
				cy.getByAriaLabel('Right').click();
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('right').to.be.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);

				expect('right').to.be.equal(getSelectedBlock(data, 'align'));
			});

			// justify is not valid for wp
			cy.get('@container').within(() => {
				cy.getByAriaLabel('Justify').click();
			});

			// Blockera value should NOT moved to WP data
			getWPDataObject().then((data) => {
				expect('justify').to.be.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);

				expect(undefined).to.be.equal(getSelectedBlock(data, 'align'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear value
			cy.get('@container').within(() => {
				cy.getByAriaLabel('Justify').click();
			});

			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);

				expect(undefined).to.be.equal(getSelectedBlock(data, 'align'));
			});
		});
	});
});

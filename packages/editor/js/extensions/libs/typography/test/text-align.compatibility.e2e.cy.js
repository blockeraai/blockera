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

describe('Text Align → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('in paragraph the attribute is align', () => {
			appendBlocks(
				`<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Test paragraph...</p>
<!-- /wp:paragraph -->`
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

		it('Changing align from block toolbar affects the Blockera text align', () => {
			appendBlocks(
				`<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Test paragraph...</p>
<!-- /wp:paragraph -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			//
			// Change align to left
			//
			cy.get('button[aria-label="Align text"]').click();
			cy.get('div[aria-label="Align text"] button').eq(0).click();

			//
			// assert values
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('left').to.be.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);

				expect('left').to.be.equal(getSelectedBlock(data, 'align'));
			});

			//
			// Change align to center
			//
			cy.get('button[aria-label="Align text"]').click();
			cy.get('div[aria-label="Align text"] button').eq(1).click();

			//
			// assert values
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('center').to.be.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);

				expect('center').to.be.equal(getSelectedBlock(data, 'align'));
			});

			//
			// Change align to center
			//
			cy.get('button[aria-label="Align text"]').click();
			cy.get('div[aria-label="Align text"] button').eq(2).click();

			//
			// assert values
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('right').to.be.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);

				expect('right').to.be.equal(getSelectedBlock(data, 'align'));
			});
		});
	});

	describe('Heading Block', () => {
		it('in heading the attribute is textAlign', () => {
			appendBlocks(
				`<!-- wp:heading {"textAlign":"center","level":1,"fontSize":"x-large"} -->
<h1 class="wp-block-heading has-text-align-center has-x-large-font-size">A commitment to innovation and sustainability</h1>
<!-- /wp:heading -->`
			);

			// Select target block
			cy.getBlock('core/heading').click();

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

				expect('center').to.be.equal(
					getSelectedBlock(data, 'textAlign')
				);
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

				expect('right').to.be.equal(
					getSelectedBlock(data, 'textAlign')
				);
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

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'textAlign')
				);
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

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'textAlign')
				);
			});
		});

		it('Changing align from block toolbar affects the Blockera text align', () => {
			appendBlocks(
				`<!-- wp:heading {"textAlign":"center","level":1,"fontSize":"x-large"} -->
<h1 class="wp-block-heading has-text-align-center has-x-large-font-size">A commitment to innovation and sustainability</h1>
<!-- /wp:heading -->`
			);

			// Select target block
			cy.getBlock('core/heading').click();

			//
			// Change align to left
			//
			cy.get('button[aria-label="Align text"]').click();
			cy.get('div[aria-label="Align text"] button').eq(0).click();

			//
			// assert values
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('left').to.be.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);

				expect('left').to.be.equal(getSelectedBlock(data, 'textAlign'));
			});

			//
			// Change align to center
			//
			cy.get('button[aria-label="Align text"]').click();
			cy.get('div[aria-label="Align text"] button').eq(1).click();

			//
			// assert values
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('center').to.be.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);

				expect('center').to.be.equal(
					getSelectedBlock(data, 'textAlign')
				);
			});

			//
			// Change align to center
			//
			cy.get('button[aria-label="Align text"]').click();
			cy.get('div[aria-label="Align text"] button').eq(2).click();

			//
			// assert values
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('right').to.be.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);

				expect('right').to.be.equal(
					getSelectedBlock(data, 'textAlign')
				);
			});
		});
	});
});

/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

Cypress.Commands.add('editTransition', (duration = 200, delay = 2000) => {
	cy.getParentContainer('Transitions').as('transition');
	cy.get('@transition').within(() => {
		cy.getByDataCy('group-control-header').click();
	});

	cy.get('.components-popover')
		.last()
		.within(() => {
			cy.getByDataTest('transition-input-duration').clear();
			cy.getByDataTest('transition-input-duration').type(duration, delay);

			cy.getParentContainer('Timing').within(() => {
				// check disabled options
				cy.get('select').within(() => {
					cy.get('[value="ease-in-quad"]').should('be.disabled');
					cy.get('[value="ease-in-cubic"]').should('be.disabled');
				});

				cy.get('select').select('ease-in-out');
			});

			cy.getByDataTest('transition-input-delay').clear();
			cy.getByDataTest('transition-input-delay').type(2000);
		});
});

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

			cy.getParentContainer('Text Align').as('container');

			cy.addNewTransition();

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

			cy.addNewTransition();

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

			cy.editTransition(200, 2000);

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

			cy.editTransition(201, 2001);

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

			cy.getParentContainer('Text Align').as('container');

			cy.addNewTransition();

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

			cy.addNewTransition();

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

			cy.editTransition(200, 2000);

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

			cy.editTransition(201, 2001);

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

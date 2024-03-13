/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Width → WP Compatibility', () => {
	describe('Search Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				'<!-- wp:search {"label":"Search","width":500,"widthUnit":"px","buttonText":"Search"} /-->'
			);

			// Select target block
			cy.get('[data-type="core/search"]').click();

			// add alias to the feature container
			cy.get('[aria-label="Width"]')
				.closest('[data-cy="base-control"]')
				.as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('500px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change value
			cy.get('@widthContainer').within(() => {
				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('100', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect(100).to.be.equal(getSelectedBlock(data, 'width'));

				expect('px').to.be.equal(getSelectedBlock(data, 'widthUnit'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@widthContainer').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'widthUnit')
				);
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				'<!-- wp:search {"label":"Search","width":500,"widthUnit":"px","buttonText":"Search"} /-->'
			);

			// Select target block
			cy.get('[data-type="core/search"]').click();

			// add alias to the feature container
			cy.get('[aria-label="Width"]')
				.closest('[data-cy="base-control"]')
				.as('widthContainer');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('500px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//
			// Test 2: Blockera invalid value -> do not move to WP
			//

			cy.get('@widthContainer').within(() => {
				cy.get('[aria-label="Select Unit"]').select('auto', {
					force: true,
				});
			});

			// Blockera value should NOT be moved to WP data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'widthUnit')
				);
			});

			//
			// Test 3: Switch back to valid data (%)
			//

			cy.get('@widthContainer').within(() => {
				cy.get('[aria-label="Select Unit"]').select('%');

				cy.get('input').as('widthInput');
				cy.get('@widthInput').clear();
				cy.get('@widthInput').type('100', { force: true });
			});

			// WP data should be
			getWPDataObject().then((data) => {
				expect(100).to.be.equal(getSelectedBlock(data, 'width'));

				expect('%').to.be.equal(getSelectedBlock(data, 'widthUnit'));
			});
		});
	});
});

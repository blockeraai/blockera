/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Box Position → WP Compatibility', () => {
	describe('Group Block', () => {
		it('Simple Position', () => {
			appendBlocks(
				'<!-- wp:group {"style":{"position":{"type":"sticky","top":"0px"}},"layout":{"type":"constrained"}} -->\n' +
					'<div class="wp-block-group"><!-- wp:paragraph -->\n' +
					'<p>paragraph inside group</p>\n' +
					'<!-- /wp:paragraph --></div>\n' +
					'<!-- /wp:group -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Switch to parent group block
			cy.get('[aria-label="Select Group"]').click();

			// add alias to the feature container
			cy.getParentContainer('Position').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					type: 'sticky',
					position: {
						top: '0px',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherPosition')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change position
			cy.get('@container').within(() => {
				cy.get('button[aria-haspopup="listbox"]').click();
				cy.get('ul').within(() => {
					cy.contains('Absolute').trigger('click');
				});
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					top: '0px',
					right: '',
					bottom: '',
					left: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.position);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// change position
			cy.get('@container').within(() => {
				cy.get('button[aria-haspopup="listbox"]').click();
				cy.get('ul').within(() => {
					cy.contains('Default').trigger('click');
				});
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.position
				);
			});
		});
	});
});

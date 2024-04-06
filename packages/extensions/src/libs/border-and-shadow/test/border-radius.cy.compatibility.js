/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Border Radius → WP Compatibility', () => {
	describe('Button Block', () => {
		it('Compacted corners border radius', () => {
			appendBlocks(
				'<!-- wp:buttons -->\n' +
					'<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":"5px"}}} -->\n' +
					'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="border-radius:5px">button</a></div>\n' +
					'<!-- /wp:button --></div>\n' +
					'<!-- /wp:buttons -->'
			);

			// Select target block
			cy.getBlock('core/button').click();

			// add alias to the feature container
			cy.getParentContainer('Radius').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: '5px',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);

				expect('5px').to.be.equal(
					getSelectedBlock(data, 'style')?.border?.radius
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// open color popover
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
				cy.get('input').type(10, { force: true, delay: 0 });
			});

			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: '10px',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);

				expect('10px').to.be.equal(
					getSelectedBlock(data, 'style')?.border?.radius
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear bg color
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.border?.radius
				);
			});
		});

		it('custom corners border radius', () => {
			appendBlocks(
				'<!-- wp:buttons -->\n' +
					'<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":{"topLeft":"5px","topRight":"10em","bottomLeft":"15%","bottomRight":"20rem"}}}} -->\n' +
					'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="border-top-left-radius:5px;border-top-right-radius:10em;border-bottom-left-radius:15%;border-bottom-right-radius:20rem">button</a></div>\n' +
					'<!-- /wp:button --></div>\n' +
					'<!-- /wp:buttons --> '
			);

			// Select target block
			cy.getBlock('core/button').click();

			// add alias to the feature container
			cy.getParentContainer('Radius').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: '',
					topLeft: '5px',
					topRight: '10em',
					bottomLeft: '15%',
					bottomRight: '20rem',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);

				expect({
					topLeft: '5px',
					topRight: '10em',
					bottomLeft: '15%',
					bottomRight: '20rem',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.border?.radius
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// open color popover
			cy.get('@container').within(() => {
				cy.get('input[type="number"]').eq(0).clear({ force: true });
				cy.get('input[type="number"]').eq(0).type(10, {
					force: true,
				});

				cy.get('input[type="number"]').eq(1).clear({ force: true });
				cy.get('input[type="number"]').eq(1).type(20, {
					force: true,
				});

				cy.get('input[type="number"]').eq(2).clear({ force: true });
				cy.get('input[type="number"]').eq(2).type(30, {
					force: true,
				});

				cy.get('input[type="number"]').eq(3).clear({ force: true });
				cy.get('input[type="number"]').eq(3).type(40, {
					force: true,
				});
			});

			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: '',
					topLeft: '10px',
					topRight: '20em',
					bottomLeft: '30%',
					bottomRight: '40rem',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);

				expect({
					topLeft: '10px',
					topRight: '20em',
					bottomLeft: '30%',
					bottomRight: '40rem',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.border?.radius
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear bg color
			cy.get('@container').within(() => {
				cy.get('input[type="number"]').eq(0).clear({ force: true });

				cy.get('input[type="number"]').eq(1).clear({ force: true });

				cy.get('input[type="number"]').eq(2).clear({ force: true });

				cy.get('input[type="number"]').eq(3).clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.border?.radius
				);
			});
		});

		it('custom corners border radius (only 2 corner)', () => {
			appendBlocks(
				'<!-- wp:buttons -->\n' +
					'<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":{"topLeft":"50%","topRight":"50%"}}}} -->\n' +
					'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="border-top-left-radius:50%;border-top-right-radius:50%">button</a></div>\n' +
					'<!-- /wp:button --></div>\n' +
					'<!-- /wp:buttons -->'
			);

			// Select target block
			cy.getBlock('core/button').click();

			// add alias to the feature container
			cy.getParentContainer('Radius').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: '',
					topLeft: '50%',
					topRight: '50%',
					bottomLeft: '',
					bottomRight: '',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);

				expect({
					topLeft: '50%',
					topRight: '50%',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.border?.radius
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// open color popover
			cy.get('@container').within(() => {
				cy.get('input[type="number"]').eq(0).clear({ force: true });
				cy.get('input[type="number"]').eq(0).type(10, {
					force: true,
				});

				cy.get('input[type="number"]').eq(1).clear({ force: true });

				cy.get('input[type="number"]').eq(2).clear({ force: true });
				cy.get('input[type="number"]').eq(2).type(30, {
					force: true,
				});
			});

			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: '',
					topLeft: '10%',
					topRight: '',
					bottomLeft: '30px',
					bottomRight: '',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);

				expect({
					topLeft: '10%',
					topRight: undefined,
					bottomLeft: '30px',
					bottomRight: undefined,
				}).to.be.deep.equal(
					getSelectedBlock(data, 'style')?.border?.radius
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear bg color
			cy.get('@container').within(() => {
				cy.get('input[type="number"]').eq(0).clear({ force: true });

				cy.get('input[type="number"]').eq(1).clear({ force: true });

				cy.get('input[type="number"]').eq(2).clear({ force: true });

				cy.get('input[type="number"]').eq(3).clear({ force: true });
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.border?.radius
				);
			});
		});
	});
});

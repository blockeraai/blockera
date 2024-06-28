/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	getSelectedBlock,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers';

describe('Border & Border Radius Together → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});
	describe('Button Block', () => {
		describe('Simple Value', () => {
			it('Compacted borders', () => {
				appendBlocks(
					'<!-- wp:buttons -->\n' +
						'<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":"10px","color":"#ff4848","width":"1px"}}} -->\n' +
						'<div class="wp-block-button"><a class="wp-block-button__link has-border-color wp-element-button" style="border-color:#ff4848;border-width:1px;border-radius:10px">button</a></div>\n' +
						'<!-- /wp:button --></div>\n' +
						'<!-- /wp:buttons -->'
				);

				// Select target block
				cy.getBlock('core/button').click();

				// add alias to the feature container
				cy.getParentContainer('Border Line').as('border');
				cy.getParentContainer('Radius').as('radius');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						type: 'all',
						all: {
							color: '#ff4848',
							width: '1px',
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						type: 'all',
						all: '10px',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorderRadius')
					);

					expect({
						radius: '10px',
						color: '#ff4848',
						width: '1px',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@border').within(() => {
					cy.get('input').clear({ force: true });
					cy.get('input').type(20, { force: true, delay: 0 });
				});

				cy.get('@radius').within(() => {
					cy.get('input').clear({ force: true });
					cy.get('input').type(20, { force: true, delay: 0 });
				});

				getWPDataObject().then((data) => {
					expect({
						type: 'all',
						all: {
							color: '#ff4848',
							width: '20px',
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						type: 'all',
						all: '20px',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorderRadius')
					);

					expect({
						radius: '20px',
						color: '#ff4848',
						width: '20px',
						style: 'solid',
						top: undefined,
						right: undefined,
						bottom: undefined,
						left: undefined,
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear all
				cy.get('@border').within(() => {
					cy.get('input').clear({ force: true });

					cy.getByDataTest('border-control-color').click();
				});

				cy.get('.components-popover').within(() => {
					cy.getByAriaLabel('Reset Color (Clear)').click({
						force: true,
					});
				});

				cy.get('@radius').within(() => {
					cy.get('input').clear({ force: true });
				});

				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						radius: undefined,
						color: undefined,
						style: undefined,
						width: undefined,
						top: undefined,
						right: undefined,
						bottom: undefined,
						left: undefined,
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});
			});

			it('Custom side borders', () => {
				appendBlocks(
					'<!-- wp:buttons -->\n' +
						'<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":{"topLeft":"10px","topRight":"20px","bottomLeft":"40px","bottomRight":"30px"},"top":{"radius":"10px","color":"#ff4848","width":"1px"},"right":{"radius":"10px","color":"#ff4848","width":"2px"},"bottom":{"radius":"10px","color":"#ff4848","width":"3px"},"left":{"radius":"10px","color":"#ff4848","width":"4px"}}}} -->\n' +
						'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="border-top-left-radius:10px;border-top-right-radius:20px;border-bottom-left-radius:40px;border-bottom-right-radius:30px;border-top-color:#ff4848;border-top-width:1px;border-right-color:#ff4848;border-right-width:2px;border-bottom-color:#ff4848;border-bottom-width:3px;border-left-color:#ff4848;border-left-width:4px">button</a></div>\n' +
						'<!-- /wp:button --></div>\n' +
						'<!-- /wp:buttons -->'
				);

				// Select target block
				cy.getBlock('core/button').click();

				// add alias to the feature container
				cy.getParentContainer('Border Line').as('border');
				cy.getParentContainer('Radius').as('radius');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						type: 'custom',
						all: {
							width: '',
							style: '',
							color: '',
						},
						top: {
							width: '1px',
							color: '#ff4848',
							style: 'solid',
						},
						right: {
							width: '2px',
							color: '#ff4848',
							style: 'solid',
						},
						bottom: {
							width: '3px',
							color: '#ff4848',
							style: 'solid',
						},
						left: {
							width: '4px',
							color: '#ff4848',
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						topLeft: '10px',
						topRight: '20px',
						bottomLeft: '40px',
						bottomRight: '30px',
						type: 'custom',
						all: '',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorderRadius')
					);

					expect({
						radius: {
							topLeft: '10px',
							topRight: '20px',
							bottomLeft: '40px',
							bottomRight: '30px',
						},
						top: {
							radius: '10px', // ! this is wp bug
							color: '#ff4848',
							width: '1px',
						},
						right: {
							radius: '10px', // ! this is wp bug
							color: '#ff4848',
							width: '2px',
						},
						bottom: {
							radius: '10px', // ! this is wp bug
							color: '#ff4848',
							width: '3px',
						},
						left: {
							radius: '10px', // ! this is wp bug
							color: '#ff4848',
							width: '4px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@border').within(() => {
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

				cy.get('@radius').within(() => {
					cy.get('input[type="number"]').eq(0).clear({ force: true });
					cy.get('input[type="number"]').eq(0).type(50, {
						force: true,
					});

					cy.get('input[type="number"]').eq(1).clear({ force: true });
					cy.get('input[type="number"]').eq(1).type(60, {
						force: true,
					});

					cy.get('input[type="number"]').eq(2).clear({ force: true });
					cy.get('input[type="number"]').eq(2).type(70, {
						force: true,
					});

					cy.get('input[type="number"]').eq(3).clear({ force: true });
					cy.get('input[type="number"]').eq(3).type(80, {
						force: true,
					});
				});

				getWPDataObject().then((data) => {
					expect({
						type: 'custom',
						all: {
							width: '',
							style: '',
							color: '',
						},
						top: {
							width: '10px',
							color: '#ff4848',
							style: 'solid',
						},
						right: {
							width: '20px',
							color: '#ff4848',
							style: 'solid',
						},
						bottom: {
							width: '30px',
							color: '#ff4848',
							style: 'solid',
						},
						left: {
							width: '40px',
							color: '#ff4848',
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						type: 'custom',
						all: '',
						topLeft: '50px',
						topRight: '60px',
						bottomLeft: '70px',
						bottomRight: '80px',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorderRadius')
					);

					expect({
						width: undefined,
						color: undefined,
						style: undefined,
						radius: {
							topLeft: '50px',
							topRight: '60px',
							bottomLeft: '70px',
							bottomRight: '80px',
						},
						top: {
							radius: '10px', // ! this is wp bug
							color: '#ff4848',
							width: '10px',
							style: 'solid',
						},
						right: {
							radius: '10px', // ! this is wp bug
							color: '#ff4848',
							width: '20px',
							style: 'solid',
						},
						bottom: {
							radius: '10px', // ! this is wp bug
							color: '#ff4848',
							width: '30px',
							style: 'solid',
						},
						left: {
							radius: '10px', // ! this is wp bug
							color: '#ff4848',
							width: '40px',
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.get('@border').within(() => {
					cy.get('input[type="number"]').eq(0).clear({ force: true });

					cy.get('input[type="number"]').eq(1).clear({ force: true });

					cy.get('input[type="number"]').eq(2).clear({ force: true });

					cy.get('input[type="number"]').eq(3).clear({ force: true });
				});

				[0, 1, 2, 3].forEach((i) => {
					cy.get('@border').within(() => {
						cy.getByDataTest('border-control-color').eq(i).click();
					});

					cy.get('.components-popover')
						.last()
						.within(() => {
							cy.getByAriaLabel('Reset Color (Clear)').click({
								force: true,
							});
						});
				});

				cy.get('@radius').within(() => {
					cy.get('input[type="number"]').eq(0).clear({ force: true });

					cy.get('input[type="number"]').eq(1).clear({ force: true });

					cy.get('input[type="number"]').eq(2).clear({ force: true });

					cy.get('input[type="number"]').eq(3).clear({ force: true });
				});

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect({
						type: 'custom',
						all: {
							width: '',
							style: '',
							color: '',
						},
						top: {
							width: '',
							color: '',
							style: '',
						},
						right: {
							width: '',
							color: '',
							style: '',
						},
						bottom: {
							width: '',
							color: '',
							style: '',
						},
						left: {
							width: '',
							color: '',
							style: '',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						color: undefined,
						style: undefined,
						width: undefined,
						radius: undefined,
						top: undefined,
						right: undefined,
						bottom: undefined,
						left: undefined,
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});
			});
		});
	});
});

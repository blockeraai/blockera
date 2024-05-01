/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Border → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Button Block', () => {
		describe('Simple Value', () => {
			it('Compacted borders', () => {
				appendBlocks(
					'<!-- wp:buttons -->\n' +
						'<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"color":"#ffb2b2","width":"1px"}}} -->\n' +
						'<div class="wp-block-button"><a class="wp-block-button__link has-border-color wp-element-button" style="border-color:#ffb2b2;border-width:1px">button</a></div>\n' +
						'<!-- /wp:button --></div>\n' +
						'<!-- /wp:buttons -->'
				);

				// Select target block
				cy.getBlock('core/button').click();

				// add alias to the feature container
				cy.getParentContainer('Border Line').as('container');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						type: 'all',
						all: {
							color: '#ffb2b2',
							width: '1px',
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({ color: '#ffb2b2', width: '1px' }).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@container').within(() => {
					cy.get('input').clear({ force: true });
					cy.get('input').type(10, { force: true, delay: 0 });
				});

				getWPDataObject().then((data) => {
					expect({
						type: 'all',
						all: {
							color: '#ffb2b2',
							width: '10px',
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						color: '#ffb2b2',
						style: 'solid',
						width: '10px',
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

				// clear width
				cy.get('@container').within(() => {
					cy.get('input').clear({ force: true });
				});

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect({
						type: 'all',
						all: {
							width: '',
							style: 'solid',
							color: '#ffb2b2',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						color: '#ffb2b2',
						style: 'solid',
						width: '',
						top: undefined,
						right: undefined,
						bottom: undefined,
						left: undefined,
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});

				// clear all
				cy.get('@container').within(() => {
					cy.get('input').clear({ force: true });

					cy.getByDataTest('border-control-color').click();
				});

				cy.get('.components-popover').within(() => {
					cy.getByAriaLabel('Reset Color (Clear)').click({
						force: true,
					});
				});

				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
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
						'<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"top":{"color":"#ffb2b2","width":"1px"},"right":{"color":"#f22f2f","width":"2px"},"bottom":{"color":"#8f33cc","width":"3px"},"left":{"color":"#35f348","width":"4px"}}}} -->\n' +
						'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="border-top-color:#ffb2b2;border-top-width:1px;border-right-color:#f22f2f;border-right-width:2px;border-bottom-color:#8f33cc;border-bottom-width:3px;border-left-color:#35f348;border-left-width:4px">button</a></div>\n' +
						'<!-- /wp:button --></div>\n' +
						'<!-- /wp:buttons -->'
				);

				// Select target block
				cy.getBlock('core/button').click();

				// add alias to the feature container
				cy.getParentContainer('Border Line').as('container');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						type: 'custom',
						all: {
							width: '',
							color: '',
							style: '',
						},
						top: {
							width: '1px',
							color: '#ffb2b2',
							style: 'solid',
						},
						right: {
							width: '2px',
							color: '#f22f2f',
							style: 'solid',
						},
						bottom: {
							width: '3px',
							color: '#8f33cc',
							style: 'solid',
						},
						left: {
							width: '4px',
							color: '#35f348',
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						top: {
							color: '#ffb2b2',
							width: '1px',
						},
						right: {
							color: '#f22f2f',
							width: '2px',
						},
						bottom: {
							color: '#8f33cc',
							width: '3px',
						},
						left: {
							color: '#35f348',
							width: '4px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

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
						all: {
							width: '',
							style: '',
							color: '',
						},
						top: {
							width: '10px',
							color: '#ffb2b2',
							style: 'solid',
						},
						right: {
							width: '20px',
							color: '#f22f2f',
							style: 'solid',
						},
						bottom: {
							width: '30px',
							color: '#8f33cc',
							style: 'solid',
						},
						left: {
							width: '40px',
							color: '#35f348',
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						width: undefined,
						color: undefined,
						style: undefined,
						top: {
							color: '#ffb2b2',
							width: '10px',
							style: 'solid',
						},
						right: {
							color: '#f22f2f',
							width: '20px',
							style: 'solid',
						},
						bottom: {
							color: '#8f33cc',
							width: '30px',
							style: 'solid',
						},
						left: {
							color: '#35f348',
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

				cy.get('@container').within(() => {
					cy.get('input[type="number"]').eq(0).clear({ force: true });

					cy.get('input[type="number"]').eq(1).clear({ force: true });

					cy.get('input[type="number"]').eq(2).clear({ force: true });

					cy.get('input[type="number"]').eq(3).clear({ force: true });
				});

				[0, 1, 2, 3].forEach((i) => {
					cy.get('@container').within(() => {
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

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
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

			it('Custom side borders (only top and bottom)', () => {
				appendBlocks(
					'<!-- wp:buttons -->\n' +
						'<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"top":{"color":"#ffb2b2","width":"1px"},"bottom":{"color":"#8f33cc","width":"3px"},"left":{}}}} -->\n' +
						'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="border-top-color:#ffb2b2;border-top-width:1px;border-bottom-color:#8f33cc;border-bottom-width:3px">button</a></div>\n' +
						'<!-- /wp:button --></div>\n' +
						'<!-- /wp:buttons -->'
				);

				// Select target block
				cy.getBlock('core/button').click();

				// add alias to the feature container
				cy.getParentContainer('Border Line').as('container');

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
							color: '#ffb2b2',
							style: 'solid',
						},
						right: {
							width: '',
							color: '',
							style: 'solid',
						},
						bottom: {
							width: '3px',
							color: '#8f33cc',
							style: 'solid',
						},
						left: {
							width: '',
							color: '',
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						color: '#ffb2b2',
						width: '1px',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border?.top
					);

					expect({
						color: '#8f33cc',
						width: '3px',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border?.bottom
					);
				});

				//
				// Test 2: Clear Blockera value and check WP data
				//

				cy.get('@container').within(() => {
					cy.get('input[type="number"]').eq(0).clear({ force: true });

					cy.get('input[type="number"]').eq(1).clear({ force: true });

					cy.get('input[type="number"]').eq(2).clear({ force: true });

					cy.get('input[type="number"]').eq(3).clear({ force: true });
				});

				[0, 2].forEach((i) => {
					cy.get('@container').within(() => {
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

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
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
		});

		describe('Variable Value', () => {
			// todo change color variable item and improve test to do it
			it('Compacted borders', () => {
				appendBlocks(
					'<!-- wp:buttons -->\n' +
						'<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"width":"1px"}},"borderColor":"accent-3"} -->\n' +
						'<div class="wp-block-button"><a class="wp-block-button__link has-border-color has-accent-3-border-color wp-element-button" style="border-width:1px">button</a></div>\n' +
						'<!-- /wp:button --></div>\n' +
						'<!-- /wp:buttons -->'
				);

				// Select target block
				cy.getBlock('core/button').click();

				// add alias to the feature container
				cy.getParentContainer('Border Line').as('container');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						type: 'all',
						all: {
							width: '1px',
							color: {
								settings: {
									name: 'Accent / Three',
									id: 'accent-3',
									value: '#d8613c',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Four',
									},
									type: 'color',
									var: '--wp--preset--color--accent-3',
								},
								name: 'Accent / Three',
								isValueAddon: true,
								valueType: 'variable',
							},
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect('accent-3').to.be.equal(
						getSelectedBlock(data, 'borderColor')
					);

					expect({ width: '1px' }).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@container').within(() => {
					cy.get('input').clear({ force: true });
					cy.get('input').type(10, { force: true, delay: 0 });
				});

				getWPDataObject().then((data) => {
					expect({
						type: 'all',
						all: {
							width: '10px',
							color: {
								settings: {
									name: 'Accent / Three',
									id: 'accent-3',
									value: '#d8613c',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Four',
									},
									type: 'color',
									var: '--wp--preset--color--accent-3',
								},
								name: 'Accent / Three',
								isValueAddon: true,
								valueType: 'variable',
							},
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect('accent-3').to.be.equal(
						getSelectedBlock(data, 'borderColor')
					);

					expect({
						width: '10px',
						color: undefined,
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
				cy.get('@container').within(() => {
					cy.get('input').clear({ force: true });

					cy.getByDataTest('border-control-color').click();
				});

				cy.get('.components-popover').within(() => {
					cy.getByAriaLabel('Reset Color (Clear)').click({
						force: true,
					});
				});

				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'borderColor')
					);

					expect({
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

			// todo change color variable item and improve test to do it
			it('Custom side borders', () => {
				appendBlocks(
					'<!-- wp:buttons -->\n' +
						'<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"top":{"width":"1px","color":"var:preset|color|accent-3"},"right":{"color":"var:preset|color|accent-4","width":"1px"},"bottom":{"color":"var:preset|color|accent-2","width":"1px"},"left":{"color":"var:preset|color|accent-5","width":"1px"}}}} -->\n' +
						'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="border-top-color:var(--wp--preset--color--accent-3);border-top-width:1px;border-right-color:var(--wp--preset--color--accent-4);border-right-width:1px;border-bottom-color:var(--wp--preset--color--accent-2);border-bottom-width:1px;border-left-color:var(--wp--preset--color--accent-5);border-left-width:1px">button</a></div>\n' +
						'<!-- /wp:button --></div>\n' +
						'<!-- /wp:buttons -->'
				);

				// Select target block
				cy.getBlock('core/button').click();

				// add alias to the feature container
				cy.getParentContainer('Border Line').as('container');

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
							color: {
								settings: {
									name: 'Accent / Three',
									id: 'accent-3',
									value: '#d8613c',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Four',
									},
									type: 'color',
									var: '--wp--preset--color--accent-3',
								},
								name: 'Accent / Three',
								isValueAddon: true,
								valueType: 'variable',
							},
							style: 'solid',
						},
						right: {
							width: '1px',
							color: {
								settings: {
									name: 'Accent / Four',
									id: 'accent-4',
									value: '#b1c5a4',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Four',
									},
									type: 'color',
									var: '--wp--preset--color--accent-4',
								},
								name: 'Accent / Four',
								isValueAddon: true,
								valueType: 'variable',
							},
							style: 'solid',
						},
						bottom: {
							width: '1px',
							color: {
								settings: {
									name: 'Accent / Two',
									id: 'accent-2',
									value: '#c2a990',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Four',
									},
									type: 'color',
									var: '--wp--preset--color--accent-2',
								},
								name: 'Accent / Two',
								isValueAddon: true,
								valueType: 'variable',
							},
							style: 'solid',
						},
						left: {
							width: '1px',
							color: {
								settings: {
									name: 'Accent / Five',
									id: 'accent-5',
									value: '#b5bdbc',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Four',
									},
									type: 'color',
									var: '--wp--preset--color--accent-5',
								},
								name: 'Accent / Five',
								isValueAddon: true,
								valueType: 'variable',
							},
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						top: {
							width: '1px',
							color: 'var:preset|color|accent-3',
						},
						right: {
							color: 'var:preset|color|accent-4',
							width: '1px',
						},
						bottom: {
							color: 'var:preset|color|accent-2',
							width: '1px',
						},
						left: {
							color: 'var:preset|color|accent-5',
							width: '1px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.border
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

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
						all: {
							width: '',
							style: '',
							color: '',
						},
						top: {
							width: '10px',
							color: {
								settings: {
									name: 'Accent / Three',
									id: 'accent-3',
									value: '#d8613c',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Four',
									},
									type: 'color',
									var: '--wp--preset--color--accent-3',
								},
								name: 'Accent / Three',
								isValueAddon: true,
								valueType: 'variable',
							},
							style: 'solid',
						},
						right: {
							width: '20px',
							color: {
								settings: {
									name: 'Accent / Four',
									id: 'accent-4',
									value: '#b1c5a4',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Four',
									},
									type: 'color',
									var: '--wp--preset--color--accent-4',
								},
								name: 'Accent / Four',
								isValueAddon: true,
								valueType: 'variable',
							},
							style: 'solid',
						},
						bottom: {
							width: '30px',
							color: {
								settings: {
									name: 'Accent / Two',
									id: 'accent-2',
									value: '#c2a990',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Four',
									},
									type: 'color',
									var: '--wp--preset--color--accent-2',
								},
								name: 'Accent / Two',
								isValueAddon: true,
								valueType: 'variable',
							},
							style: 'solid',
						},
						left: {
							width: '40px',
							color: {
								settings: {
									name: 'Accent / Five',
									id: 'accent-5',
									value: '#b5bdbc',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Four',
									},
									type: 'color',
									var: '--wp--preset--color--accent-5',
								},
								name: 'Accent / Five',
								isValueAddon: true,
								valueType: 'variable',
							},
							style: 'solid',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
						width: undefined,
						color: undefined,
						style: undefined,
						top: {
							width: '10px',
							color: 'var:preset|color|accent-3',
							style: 'solid',
						},
						right: {
							color: 'var:preset|color|accent-4',
							width: '20px',
							style: 'solid',
						},
						bottom: {
							color: 'var:preset|color|accent-2',
							width: '30px',
							style: 'solid',
						},
						left: {
							color: 'var:preset|color|accent-5',
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

				cy.get('@container').within(() => {
					cy.get('input[type="number"]').eq(0).clear({ force: true });

					cy.get('input[type="number"]').eq(1).clear({ force: true });

					cy.get('input[type="number"]').eq(2).clear({ force: true });

					cy.get('input[type="number"]').eq(3).clear({ force: true });
				});

				[0, 1, 2, 3].forEach((i) => {
					cy.get('@container').within(() => {
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

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'blockeraBorder')
					);

					expect({
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
		});
	});
});

/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	getSelectedBlock,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers';

describe('Background → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});
	describe('Paragraph Block', () => {
		describe('Linear Gradient Background', () => {
			it('Simple Value', () => {
				appendBlocks(
					'<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(135deg,rgb(135,254,56) 1%,rgb(255,147,147) 97%)"}}} -->\n' +
						'<p class="has-background" style="background:linear-gradient(135deg,rgb(135,254,56) 1%,rgb(255,147,147) 97%)">Paragraph with linear gradient background (simple colors)</p>\n' +
						'<!-- /wp:paragraph -->'
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// add alias to the feature container
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						'linear-gradient-0': {
							isVisible: true,
							type: 'linear-gradient',
							'linear-gradient':
								'linear-gradient(135deg,rgb(135,254,56) 1%,rgb(255,147,147) 97%)',
							'linear-gradient-angel': '135',
							'linear-gradient-repeat': 'no-repeat',
							'linear-gradient-attachment': 'scroll',
							order: 1,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="linear-gradient-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				// change color to #666 (#666666)
				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.getParentContainer('Angel').within(() => {
							cy.get('input[type="number"]').as('angelInput');
							cy.get('@angelInput').clear();
							cy.get('@angelInput').type('45');
						});
					});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					expect(
						'linear-gradient(45deg,rgb(135,254,56) 1%,rgb(255,147,147) 97%)'
					).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.gradient
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear bg color
				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete linear gradient 0').click({
						force: true,
					});
				});

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.gradient
					);
				});
			});

			it('Variable', () => {
				appendBlocks(
					`<!-- wp:paragraph {"gradient":"vivid-cyan-blue-to-vivid-purple"} -->
<p class="has-vivid-cyan-blue-to-vivid-purple-gradient-background has-background">Paragraph with linear gradient background (variable)</p>
<!-- /wp:paragraph -->`
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// add alias to the feature container
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						'linear-gradient-0': {
							type: 'linear-gradient',
							'linear-gradient': {
								settings: {
									name: 'Vivid cyan blue to vivid purple',
									id: 'vivid-cyan-blue-to-vivid-purple',
									value: 'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Five',
									},
									type: 'linear-gradient',
									var: '--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple',
								},
								name: 'Vivid cyan blue to vivid purple',
								isValueAddon: true,
								valueType: 'variable',
							},
							'linear-gradient-angel': '',
							'linear-gradient-repeat': 'no-repeat',
							'linear-gradient-attachment': 'scroll',
							isVisible: true,
							order: 1,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="linear-gradient-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				// Open variables popover
				cy.get(
					'.components-popover.blockera-control-background-popover'
				).within(() => {
					cy.clickValueAddonButton();
				});

				cy.wait(500);

				// change variable
				cy.get(
					'.components-popover.blockera-control-popover-variables'
				).within(() => {
					cy.selectValueAddonItem(
						'light-green-cyan-to-vivid-green-cyan'
					);
				});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					expect('light-green-cyan-to-vivid-green-cyan').to.be.equal(
						getSelectedBlock(data, 'gradient')
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear bg color
				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete linear gradient 0').click({
						force: true,
					});
				});

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style').gradient
					);
				});
			});
		});

		describe('Radial Gradient Background', () => {
			it('Simple Value', () => {
				appendBlocks(
					'<!-- wp:paragraph {"style":{"color":{"gradient":"radial-gradient(rgb(194,169,144) 27%,rgb(254,95,95) 92%)"}}} -->\n' +
						'<p class="has-background" style="background:radial-gradient(rgb(194,169,144) 27%,rgb(254,95,95) 92%)">Paragraph with linear gradient background (simple colors)</p>\n' +
						'<!-- /wp:paragraph -->'
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// add alias to the feature container
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						'radial-gradient-0': {
							isVisible: true,
							type: 'radial-gradient',
							'radial-gradient':
								'radial-gradient(rgb(194,169,144) 27%,rgb(254,95,95) 92%)',
							'radial-gradient-position': {
								top: '50%',
								left: '50%',
							},
							'radial-gradient-size': 'farthest-corner',
							'radial-gradient-repeat': 'no-repeat',
							'radial-gradient-attachment': 'scroll',
							order: 1,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="radial-gradient-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('[data-value="farthest-side"]').click();
					});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					expect(
						'radial-gradient(rgb(194,169,144) 27%,rgb(254,95,95) 92%)'
					).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.gradient
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear bg color
				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete radial gradient 0').click({
						force: true,
					});
				});

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.gradient
					);
				});
			});
		});
	});

	describe('Group Block', () => {
		describe('Background Image', () => {
			it('simple value background image', () => {
				appendBlocks(
					'<!-- wp:group {"style":{"background":{"backgroundImage":{"url":"https://placehold.co/600x400","id":87,"source":"file","title":"about-sofia"}}},"layout":{"type":"constrained"}} -->\n' +
						'<div class="wp-block-group"><!-- wp:paragraph -->\n' +
						'<p>Paragraph inside group block</p>\n' +
						'<!-- /wp:paragraph --></div>\n' +
						'<!-- /wp:group -->'
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// Switch to parent block
				cy.getByAriaLabel(
					'Select Group',
					'Select parent block: Group'
				).click();

				// add alias to the feature container
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'custom',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '50%',
								left: '50%',
							},
							'image-repeat': 'repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="image-0"]').as('repeaterBtn');
					cy.get('@repeaterBtn').click();
				});

				// change an inner item of background image
				// to make sure the value will be moved to WP data again
				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('[data-value="cover"]').click();
					});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					expect({
						url: 'https://placehold.co/600x400',
						id: 0,
						source: 'file',
						title: 'background image',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundImage
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear bg color
				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete image 0').click({
						force: true,
					});
				});

				// WP data should be removed too
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.background
							?.backgroundImage
					);
				});

				getWPDataObject().then((data) => {
					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraBackground')
					);
				});
			});
		});
	});
});

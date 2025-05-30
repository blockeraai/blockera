/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Icon Block → Inner Blocks → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Width', () => {
		appendBlocks(
			`<!-- wp:outermost/icon-block {"iconName":"wordpress-image","width":"100px"} -->
<div class="wp-block-outermost-icon-block"><div class="icon-container" style="width:100px"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"></path></svg></div></div>
<!-- /wp:outermost/icon-block -->
			`
		);

		// Select target block
		cy.getBlock('outermost/icon-block').first().click();

		//
		// Test 1: WP data to Blockera
		//

		// WP data should come to Blockera
		getWPDataObject().then((data) => {
			expect('100px').to.be.equal(getSelectedBlock(data, 'width'));

			expect('100px').to.be.equal(
				getSelectedBlock(data, 'blockeraWidth')
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		cy.getParentContainer('Width').within(() => {
			cy.get('input').clear({ force: true });
			cy.get('input').type('150', { force: true });
		});

		//
		// Check
		//
		getWPDataObject().then((data) => {
			expect('150px').to.be.equal(getSelectedBlock(data, 'width'));

			expect('150px').to.be.equal(
				getSelectedBlock(data, 'blockeraWidth')
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		cy.resetBlockeraAttribute('Size', 'Width', 'reset');

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(getSelectedBlock(data, 'width'));

			expect('').to.be.equal(getSelectedBlock(data, 'blockeraWidth'));
		});
	});

	describe('Color & Icon Color', () => {
		it('Simple Value', () => {
			appendBlocks(
				`<!-- wp:outermost/icon-block {"iconName":"wordpress-image","customIconBackgroundColor":"#880000","iconBackgroundColorValue":"#880000","customIconColor":"#f3f3f3","iconColorValue":"#f3f3f3","width":"100px"} -->
<div class="wp-block-outermost-icon-block"><div class="icon-container has-icon-color has-icon-background-color" style="background-color:#880000;color:#f3f3f3;width:100px"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"></path></svg></div></div>
<!-- /wp:outermost/icon-block -->
			`
			);

			// Select target block
			cy.getBlock('outermost/icon-block').first().click();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconColor')
				);
				expect('#f3f3f3').to.be.equal(
					getSelectedBlock(data, 'customIconColor')
				);
				expect('#f3f3f3').to.be.equal(
					getSelectedBlock(data, 'iconColorValue')
				);
				expect('#f3f3f3').to.be.equal(
					getSelectedBlock(data, 'blockeraFontColor')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColor')
				);
				expect('#880000').to.be.equal(
					getSelectedBlock(data, 'customIconBackgroundColor')
				);
				expect('#880000').to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColorValue')
				);
				expect('#880000').to.be.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.getParentContainer('BG Color').within(() => {
				cy.get('button').click();
			});

			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('input').as('hexColorInput');
					cy.get('@hexColorInput').clear();
					cy.get('@hexColorInput').type('666');
				});

			cy.getParentContainer('Text Color').within(() => {
				cy.get('button').click();
			});

			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('input').as('hexColorInput');
					cy.get('@hexColorInput').clear();
					cy.get('@hexColorInput').type('888');
				});

			//
			// Check
			//
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconColor')
				);
				expect('#888888').to.be.equal(
					getSelectedBlock(data, 'customIconColor')
				);
				expect('#888888').to.be.equal(
					getSelectedBlock(data, 'iconColorValue')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColor')
				);
				expect('#666666').to.be.equal(
					getSelectedBlock(data, 'customIconBackgroundColor')
				);
				expect('#666666').to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColorValue')
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			cy.getParentContainer('BG Color').within(() => {
				cy.get('button').click();
			});

			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('button[aria-label="Reset Color (Clear)"]').click();
				});

			cy.getParentContainer('Text Color').within(() => {
				cy.get('button').click();
			});

			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('button[aria-label="Reset Color (Clear)"]').click();
				});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'customIconColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconColorValue')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'customIconBackgroundColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColorValue')
				);
			});
		});

		it('Variable Value', () => {
			appendBlocks(
				`<!-- wp:outermost/icon-block {"iconName":"wordpress-image","iconBackgroundColor":"contrast","iconBackgroundColorValue":"#111111","iconColor":"base","iconColorValue":"#f9f9f9","width":"100px"} -->
<div class="wp-block-outermost-icon-block"><div class="icon-container has-icon-color has-icon-background-color has-contrast-background-color has-base-color" style="background-color:#111111;color:#f9f9f9;width:100px"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"></path></svg></div></div>
<!-- /wp:outermost/icon-block -->
			`
			);

			// Select target block
			cy.getBlock('outermost/icon-block').first().click();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('base').to.be.equal(getSelectedBlock(data, 'iconColor'));
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'customIconColor')
				);
				expect('#f9f9f9').to.be.equal(
					getSelectedBlock(data, 'iconColorValue')
				);
				expect({
					settings: {
						name: 'Base',
						id: 'base',
						value: '#FFFFFF',
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Five',
						},
						type: 'color',
						var: '--wp--preset--color--base',
					},
					name: 'Base',
					isValueAddon: true,
					valueType: 'variable',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraFontColor')
				);

				expect('contrast').to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'customIconBackgroundColor')
				);
				expect('#111111').to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColorValue')
				);
				expect({
					settings: {
						name: 'Contrast',
						id: 'contrast',
						value: '#111111',
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Five',
						},
						type: 'color',
						var: '--wp--preset--color--contrast',
					},
					name: 'Contrast',
					isValueAddon: true,
					valueType: 'variable',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.getParentContainer('BG Color').within(() => {
				cy.clickValueAddonButton();
			});

			// change variable
			cy.selectValueAddonItem('accent-1');

			cy.getParentContainer('Text Color').within(() => {
				cy.clickValueAddonButton();
			});

			// change variable
			cy.selectValueAddonItem('accent-5');

			//
			// Check
			//
			getWPDataObject().then((data) => {
				expect('accent-5').to.be.equal(
					getSelectedBlock(data, 'iconColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'customIconColor')
				);
				expect('#FBFAF3').to.be.equal(
					getSelectedBlock(data, 'iconColorValue')
				);
				expect({
					settings: {
						name: 'Accent 5',
						id: 'accent-5',
						value: '#FBFAF3',
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Five',
						},
						type: 'color',
						var: '--wp--preset--color--accent-5',
					},
					name: 'Accent 5',
					isValueAddon: true,
					valueType: 'variable',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraFontColor')
				);

				expect('accent-1').to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'customIconBackgroundColor')
				);
				expect('#FFEE58').to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColorValue')
				);
				expect({
					settings: {
						name: 'Accent 1',
						id: 'accent-1',
						value: '#FFEE58',
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Five',
						},
						type: 'color',
						var: '--wp--preset--color--accent-1',
					},
					name: 'Accent 1',
					isValueAddon: true,
					valueType: 'variable',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			cy.getParentContainer('BG Color').within(() => {
				cy.removeValueAddon();
			});

			cy.getParentContainer('Text Color').within(() => {
				cy.removeValueAddon();
			});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'customIconColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconColorValue')
				);
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraFontColor')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'customIconBackgroundColor')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'iconBackgroundColorValue')
				);
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
			});
		});
	});

	it('Block card + CSS selectors in editor and front-end', () => {
		appendBlocks(`<!-- wp:outermost/icon-block {"iconName":"wordpress-image","width":"100px"} -->
<div class="wp-block-outermost-icon-block"><div class="icon-container" style="width:100px"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"></path></svg></div></div>
<!-- /wp:outermost/icon-block -->`);

		cy.getBlock('outermost/icon-block').click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		cy.getBlock('outermost/icon-block').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		//
		// 1. Block Style
		//

		cy.getBlock('outermost/icon-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Check settings tab
		//
		cy.getByDataTest('settings-tab').click();

		// layout settings should be hidden
		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.scrollIntoView()
				.should('be.visible');
		});

		//
		// 3. Assert styles in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block')
			.first()
			.should('have.css', 'background-clip', 'padding-box');
	});
});

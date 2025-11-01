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
			`<!-- wp:outermost/icon-block {"iconName":"wordpress-atSymbol","width":"100px"} -->
<div class="wp-block-outermost-icon-block"><div class="icon-container" style="width:100px;transform:rotate(0deg) scaleX(1) scaleY(1)"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12.5939 21C14.1472 21 16.1269 20.5701 17.0711 20.1975L16.6447 18.879C16.0964 19.051 14.3299 19.6242 12.6548 19.6242C7.4467 19.6242 4.67513 16.8726 4.67513 12C4.67513 7.21338 7.50762 4.34713 12.2893 4.34713C17.132 4.34713 19.4162 7.55732 19.4162 10.7675C19.4162 14.035 19.0508 15.4968 17.4975 15.4968C16.5838 15.4968 16.0964 14.7803 16.0964 13.9777V7.5H14.4822V8.30255H14.3909C14.1777 7.67198 12.9898 7.12739 11.467 7.2707C9.18274 7.5 7.4467 9.27707 7.4467 11.8567C7.4467 14.5796 8.81726 16.672 11.467 16.758C13.203 16.8153 14.1168 16.0127 14.4822 15.1815H14.5736C14.7563 16.414 16.401 16.8439 17.467 16.8439C20.6954 16.8439 21 13.5764 21 10.7962C21 6.86943 18.0761 3 12.3807 3C6.50254 3 3 6.3535 3 11.9427C3 17.7325 6.38071 21 12.5939 21ZM11.7107 15.2962C9.73096 15.2962 9.03046 13.6051 9.03046 11.7707C9.03046 10.1083 10.0355 8.67516 11.7716 8.67516C13.599 8.67516 14.5736 9.36306 14.5736 11.7707C14.5736 14.1497 13.7513 15.2962 11.7107 15.2962Z"></path></svg></div></div>
<!-- /wp:outermost/icon-block -->`
		);

		// Select target block
		cy.getBlock('outermost/icon-block').first().click();

		cy.addNewTransition();

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
				`<!-- wp:outermost/icon-block {"iconName":"wordpress-atSymbol","customIconBackgroundColor":"#880000","iconBackgroundColorValue":"#880000","customIconColor":"#f3f3f3","iconColorValue":"#f3f3f3","width":"100px"} -->
<div class="wp-block-outermost-icon-block"><div class="icon-container has-icon-color has-icon-background-color" style="background-color:#880000;color:#f3f3f3;width:100px;transform:rotate(0deg) scaleX(1) scaleY(1)"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12.5939 21C14.1472 21 16.1269 20.5701 17.0711 20.1975L16.6447 18.879C16.0964 19.051 14.3299 19.6242 12.6548 19.6242C7.4467 19.6242 4.67513 16.8726 4.67513 12C4.67513 7.21338 7.50762 4.34713 12.2893 4.34713C17.132 4.34713 19.4162 7.55732 19.4162 10.7675C19.4162 14.035 19.0508 15.4968 17.4975 15.4968C16.5838 15.4968 16.0964 14.7803 16.0964 13.9777V7.5H14.4822V8.30255H14.3909C14.1777 7.67198 12.9898 7.12739 11.467 7.2707C9.18274 7.5 7.4467 9.27707 7.4467 11.8567C7.4467 14.5796 8.81726 16.672 11.467 16.758C13.203 16.8153 14.1168 16.0127 14.4822 15.1815H14.5736C14.7563 16.414 16.401 16.8439 17.467 16.8439C20.6954 16.8439 21 13.5764 21 10.7962C21 6.86943 18.0761 3 12.3807 3C6.50254 3 3 6.3535 3 11.9427C3 17.7325 6.38071 21 12.5939 21ZM11.7107 15.2962C9.73096 15.2962 9.03046 13.6051 9.03046 11.7707C9.03046 10.1083 10.0355 8.67516 11.7716 8.67516C13.599 8.67516 14.5736 9.36306 14.5736 11.7707C14.5736 14.1497 13.7513 15.2962 11.7107 15.2962Z"></path></svg></div></div>
<!-- /wp:outermost/icon-block -->`
			);

			// Select target block
			cy.getBlock('outermost/icon-block').first().click();

			cy.addNewTransition();

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
			cy.setColorControlValue('BG Color', '666666');
			cy.setColorControlValue('Text Color', '888888');

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
			cy.clearColorControlValue('BG Color');
			cy.clearColorControlValue('Text Color');

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
				`<!-- wp:outermost/icon-block {"iconName":"wordpress-atSymbol","iconBackgroundColor":"contrast","iconBackgroundColorValue":"#111111","iconColor":"base","iconColorValue":"#f9f9f9","width":"100px"} -->
<div class="wp-block-outermost-icon-block"><div class="icon-container has-icon-color has-icon-background-color has-contrast-background-color has-base-color" style="background-color:#111111;color:#f9f9f9;width:100px;transform:rotate(0deg) scaleX(1) scaleY(1)"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12.5939 21C14.1472 21 16.1269 20.5701 17.0711 20.1975L16.6447 18.879C16.0964 19.051 14.3299 19.6242 12.6548 19.6242C7.4467 19.6242 4.67513 16.8726 4.67513 12C4.67513 7.21338 7.50762 4.34713 12.2893 4.34713C17.132 4.34713 19.4162 7.55732 19.4162 10.7675C19.4162 14.035 19.0508 15.4968 17.4975 15.4968C16.5838 15.4968 16.0964 14.7803 16.0964 13.9777V7.5H14.4822V8.30255H14.3909C14.1777 7.67198 12.9898 7.12739 11.467 7.2707C9.18274 7.5 7.4467 9.27707 7.4467 11.8567C7.4467 14.5796 8.81726 16.672 11.467 16.758C13.203 16.8153 14.1168 16.0127 14.4822 15.1815H14.5736C14.7563 16.414 16.401 16.8439 17.467 16.8439C20.6954 16.8439 21 13.5764 21 10.7962C21 6.86943 18.0761 3 12.3807 3C6.50254 3 3 6.3535 3 11.9427C3 17.7325 6.38071 21 12.5939 21ZM11.7107 15.2962C9.73096 15.2962 9.03046 13.6051 9.03046 11.7707C9.03046 10.1083 10.0355 8.67516 11.7716 8.67516C13.599 8.67516 14.5736 9.36306 14.5736 11.7707C14.5736 14.1497 13.7513 15.2962 11.7107 15.2962Z"></path></svg></div></div>
<!-- /wp:outermost/icon-block -->`
			);

			// Select target block
			cy.getBlock('outermost/icon-block').first().click();

			cy.addNewTransition();

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
		appendBlocks(`<!-- wp:outermost/icon-block {"iconName":"wordpress-atSymbol","width":"100px"} -->
<div class="wp-block-outermost-icon-block"><div class="icon-container" style="width:100px;transform:rotate(0deg) scaleX(1) scaleY(1)"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12.5939 21C14.1472 21 16.1269 20.5701 17.0711 20.1975L16.6447 18.879C16.0964 19.051 14.3299 19.6242 12.6548 19.6242C7.4467 19.6242 4.67513 16.8726 4.67513 12C4.67513 7.21338 7.50762 4.34713 12.2893 4.34713C17.132 4.34713 19.4162 7.55732 19.4162 10.7675C19.4162 14.035 19.0508 15.4968 17.4975 15.4968C16.5838 15.4968 16.0964 14.7803 16.0964 13.9777V7.5H14.4822V8.30255H14.3909C14.1777 7.67198 12.9898 7.12739 11.467 7.2707C9.18274 7.5 7.4467 9.27707 7.4467 11.8567C7.4467 14.5796 8.81726 16.672 11.467 16.758C13.203 16.8153 14.1168 16.0127 14.4822 15.1815H14.5736C14.7563 16.414 16.401 16.8439 17.467 16.8439C20.6954 16.8439 21 13.5764 21 10.7962C21 6.86943 18.0761 3 12.3807 3C6.50254 3 3 6.3535 3 11.9427C3 17.7325 6.38071 21 12.5939 21ZM11.7107 15.2962C9.73096 15.2962 9.03046 13.6051 9.03046 11.7707C9.03046 10.1083 10.0355 8.67516 11.7716 8.67516C13.599 8.67516 14.5736 9.36306 14.5736 11.7707C14.5736 14.1497 13.7513 15.2962 11.7107 15.2962Z"></path></svg></div></div>
<!-- /wp:outermost/icon-block -->`);

		cy.getBlock('outermost/icon-block').click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.addNewTransition();

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

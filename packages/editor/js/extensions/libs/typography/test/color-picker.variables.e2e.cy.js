/**
 * Blockera dependencies
 */
import {
	createPost,
	getSelectedBlock,
	getWPDataObject,
	openGlobalStylesColorPaletteScreen,
	redirectToFrontPage,
	savePage,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles color preset → value addon (paragraph Text Color)', () => {
	const presetName = 'E2E Color';
	/** Matches `normalizeVariablePresetSlug` for the preset display name. */
	const expectedSlug = 'e-2-e-color';
	/** Default swatch for new custom presets in Global Styles (see color palette screen). */
	const presetDefaultHex = '#000000';

	/**
	 * One shared custom color preset (free tier allows a single custom variable).
	 */
	const seedColorPreset = () => {
		openGlobalStylesColorPaletteScreen();

		cy.addNewGlobalStylesCustomColorPreset();

		// eslint-disable-next-line cypress/unsafe-to-chain-command -- last repeater row after add
		cy.getParentContainer('Custom variables').within(() => {
			cy.get('[data-cy="repeater-item"]', { timeout: 15000 })
				.last()
				.should('be.visible');
		});

		// eslint-disable-next-line cypress/unsafe-to-chain-command -- single input in preset name field
		cy.getByDataTest('global-styles-preset-name-field')
			.first()
			.should('be.visible');
		cy.getByDataTest('global-styles-preset-name-field')
			.first()
			.clear({ force: true });
		cy.getByDataTest('global-styles-preset-name-field')
			.first()
			.type(presetName, { delay: 0, force: true });

		cy.realPress('Escape');

		saveSiteEditorDirtyEntities();
	};

	it('applies the custom preset from value addons: editor CSS, block data, and front match the default hex', () => {
		seedColorPreset();

		const expectedColorDeclaration = `color: var(--wp--preset--color--${expectedSlug}, ${presetDefaultHex})`;

		createPost();

		cy.getBlock('default').type('Variable color paragraph.', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Text Color').within(() => {
			cy.openValueAddon();
		});

		cy.getByDataTest('variable-picker-popover').should('be.visible');

		cy.selectValueAddonItem(expectedSlug);

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', expectedColorDeclaration);
		});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'color',
			'rgb(0, 0, 0)'
		);

		getWPDataObject().then((data) => {
			const fontColor = getSelectedBlock(data, 'blockeraFontColor');

			expect(fontColor.isValueAddon).to.equal(true);
			expect(fontColor.valueType).to.equal('variable');
			expect(fontColor.settings.var).to.equal(
				`--wp--preset--color--${expectedSlug}`
			);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', expectedColorDeclaration);

		cy.get('.blockera-block').should('have.css', 'color', 'rgb(0, 0, 0)');
	});

	it('updates generated editor and front CSS when the preset hex is edited in global styles after picking it', () => {
		seedColorPreset();

		const editedHex = '#cc3344';
		const editedHexInput = 'cc3344';
		const expectedColorDeclaration = `color: var(--wp--preset--color--${expectedSlug}, ${editedHex})`;

		openGlobalStylesColorPaletteScreen({ reset: false });

		cy.getParentContainer('Custom variables').within(() => {
			cy.get('[data-cy="repeater-item"]', { timeout: 15000 })
				.last()
				.within(() => {
					cy.get('[data-cy="color-repeater-item-header"]').click({
						force: true,
					});
				});
		});

		cy.get('.components-popover', { timeout: 15000 }).should('be.visible');
		cy.get('.components-popover').within(() => {
			cy.getByDataCy('color-label').click({ force: true });
		});

		cy.getByDataCy('color-picker-css-value').clear({ force: true });
		cy.getByDataCy('color-picker-css-value').type(editedHexInput, {
			delay: 0,
			force: true,
		});

		cy.realPress('Escape');

		saveSiteEditorDirtyEntities();

		createPost();

		cy.getBlock('default').type('Edited preset color paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Text Color').within(() => {
			cy.openValueAddon();
		});

		cy.getByDataTest('variable-picker-popover').should('be.visible');

		cy.selectValueAddonItem(expectedSlug);

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', expectedColorDeclaration);
		});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'color',
			'rgb(204, 51, 68)'
		);

		getWPDataObject().then((data) => {
			const fontColor = getSelectedBlock(data, 'blockeraFontColor');

			expect(fontColor.isValueAddon).to.equal(true);
			expect(fontColor.valueType).to.equal('variable');
			expect(fontColor.settings.var).to.equal(
				`--wp--preset--color--${expectedSlug}`
			);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', expectedColorDeclaration);

		cy.get('.blockera-block').should(
			'have.css',
			'color',
			'rgb(204, 51, 68)'
		);
	});
});

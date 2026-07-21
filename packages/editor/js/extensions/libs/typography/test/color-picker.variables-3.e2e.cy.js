/**
 * Blockera dependencies
 */
import {
	assertVariablePickerPresetHoverPreview,
	createPost,
	getEditedGlobalStylesSetting,
	getSelectedBlock,
	assertBlockData,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesColorPaletteScreen,
	redirectToFrontPage,
	resetAndSaveGlobalStylesEntityRecord,
	savePage,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles color preset → value addon (paragraph Text Color)', () => {
	const presetName = 'E2E Color';
	/** Matches `normalizeVariablePresetSlug` for the preset display name. */
	const expectedSlug = 'e-2-e-color';
	/** Default swatch for new custom presets in Global Styles (see color palette screen). */
	const presetDefaultHex = '#000000';
	const addDataTest = 'global-styles-preset-add-color-presets-custom';

	afterEach(() => {
		resetAndSaveGlobalStylesEntityRecord();
	});

	/**
	 * One shared custom color preset (free tier allows a single custom variable).
	 */
	const seedColorPreset = () => {
		openGlobalStylesColorPaletteScreen();

		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });

		// Palette-only seed: skip style compatibility so theme blocks are not
		// hydrated into styles (keeps free-tier custom-color cleanup deterministic).
		saveSiteEditorDirtyEntities({ runCompatibility: false });

		// Ensure the slug/name landed on the global styles entity before leaving Site Editor.
		getEditedGlobalStylesSetting('color.palette.custom').then((rows) => {
			const list = Array.isArray(rows) ? rows : [];
			const row = list.find(
				(r) => String(r?.slug ?? '') === expectedSlug
			);
			expect(row, `custom palette row "${expectedSlug}"`).to.exist;
			expect(String(row.name)).to.equal(presetName);
		});
	};

	/** Opens Text Color value-addon picker and filters the catalog to the seeded preset. */
	const openTextColorVariablePickerFilteredToSeed = () => {
		cy.getParentContainer('Text Color').within(() => {
			cy.openValueAddon();
		});

		cy.getByDataTest('variable-picker-popover', { timeout: 20000 })
			.filter(':visible')
			.first()
			.should('be.visible');

		// Narrow the catalog so custom rows are not buried under theme/default palettes.
		cy.getByDataTest('variable-picker-popover')
			.filter(':visible')
			.first()
			.within(() => {
				cy.get(
					'.blockera-control-var-picker-search input[type="search"]',
					{
						timeout: 20000,
					}
				)
					.should('be.visible')
					.clear({ force: true })
					.type(presetName, { delay: 0, force: true });
			});
	};

	/** Opens Text Color value-addon picker and selects the seeded custom preset. */
	const pickSeededColorPresetInTextColor = () => {
		openTextColorVariablePickerFilteredToSeed();
		cy.selectValueAddonItem(expectedSlug);
	};

	/**
	 * Apply / edit tests run before hover: picker hover preview has been observed to
	 * pollute the next test's generated `#blockera-styles-wrapper` CSS (TT5 Base
	 * `#FBFAF3`) even when block data + palette catalog are correct.
	 */
	it('applies the custom preset from value addons: editor CSS, block data, and front match the default hex', () => {
		seedColorPreset();

		const expectedColorDeclaration = `color: var(--wp--preset--color--${expectedSlug}, ${presetDefaultHex})`;

		createPost();

		cy.getBlock('default').type('Variable color paragraph.', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		pickSeededColorPresetInTextColor();

		assertBlockData((data) => {
			const fontColor = getSelectedBlock(data, 'blockeraFontColor');

			expect(fontColor.isValueAddon).to.equal(true);
			expect(fontColor.valueType).to.equal('variable');
			expect(fontColor.settings.var).to.equal(
				`--wp--preset--color--${expectedSlug}`
			);
			expect(String(fontColor.settings.value).toLowerCase()).to.equal(
				presetDefaultHex.toLowerCase()
			);
		});

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
					cy.get('[data-cy="color-repeater-item-header"]')
						.first()
						.click({ force: true });
				});
		});

		// Scope to the visible edit popover; multiple `.components-popover` nodes
		// (and color-labels) can exist in Site Editor chrome.
		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataCy('color-btn').first().click({ force: true });
			});

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataCy('color-picker-css-value').clear({ force: true });
				cy.getByDataCy('color-picker-css-value').type(editedHexInput, {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');
		cy.realPress('Escape');

		saveSiteEditorDirtyEntities({ runCompatibility: false });

		getEditedGlobalStylesSetting('color.palette.custom').then((rows) => {
			const list = Array.isArray(rows) ? rows : [];
			const row = list.find(
				(r) => String(r?.slug ?? '') === expectedSlug
			);
			expect(row, `custom palette row "${expectedSlug}"`).to.exist;
			expect(String(row.color).toLowerCase()).to.match(
				/#cc3344|rgb\(204,\s*51,\s*68\)/
			);
		});

		createPost();

		cy.getBlock('default').type('Edited preset color paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		pickSeededColorPresetInTextColor();

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

		assertBlockData((data) => {
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

	it('previews the preset color on the selected block while hovering the picker row, then clears it on mouse leave', () => {
		seedColorPreset();

		createPost();

		cy.getBlock('default').type('Hover preview color paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		openTextColorVariablePickerFilteredToSeed();

		assertVariablePickerPresetHoverPreview({
			slug: expectedSlug,
			cssNeedle: `color: ${presetDefaultHex}`,
			blockCssProperty: 'color',
			blockCssValue: 'rgb(0, 0, 0)',
		});

		// Close the picker so preset-preview React state cannot linger into afterEach.
		cy.realPress('Escape');
	});
});

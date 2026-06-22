/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	getSelectedBlock,
	getWPDataObject,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesColorPaletteScreen,
	openGlobalStylesFontSizesVariablesScreen,
	openGlobalStylesLinearGradientsScreen,
	openGlobalStylesRadialGradientsScreen,
	openGlobalStylesSpacingScreen,
	openMoreFeaturesControl,
	openRepeaterHeaderVariablePicker,
	openSiteEditor,
	saveSiteEditorDirtyEntities,
	setBoxSpacingSide,
} from '@blockera/dev-cypress/js/helpers';
import {
	assertCustomPresetInGlobalStyles,
	assertMissingVariableActions,
	assertRecreatePresetHasStoredValue,
	assertRecreatePresetRowFields,
	appendMissingVariableBlockWithoutCachedValue,
	clickMissingVariableRecreate,
	clickMissingVariableUnlink,
	CUSTOM_PRESET_ROW_META,
	expectBlockAttrIsScalarValueAddon,
	expectBlockAttrStillBoundToVariable,
	injectCustomPresetRow,
	openMissingVariablePopover,
	removeCustomPresetFromGlobalStyles,
	skipWhenCustomPresetAddUnavailable,
} from '@blockera/dev-cypress/js/helpers/missing-variable';

/**
 * Shared combined flow: seed preset → apply → delete preset → recreate → re-delete → unlink.
 *
 * @param {object} config
 */
function runMissingVariableCombinedTest(config) {
	it(`${config.id} — recreate then unlink missing variable with cached value`, function () {
		//
		// Section 1: Setup — seed preset, apply, delete preset, assert deleted chip
		//
		config.seedPreset();
		createPost();
		cy.getBlock(config.blockName || 'default').type(
			`${config.id} missing variable paragraph.`,
			{ delay: 0 }
		);
		cy.getByAriaControls('styles-view').click();
		config.beforeApply?.();
		config.applyVariable();
		config.setContainerAlias?.();
		removeCustomPresetFromGlobalStyles(config.id, config.slug);
		cy.getBlock(config.blockName || 'default').click({ force: true });
		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-deleted"]').should('exist');
		});

		//
		// Section 2: Popover — recreate + unlink visible when cached value exists
		//
		openMissingVariablePopover();
		assertMissingVariableActions({
			unlink: true,
			recreate: true,
			remove: false,
		});
		cy.realPress('Escape');

		//
		// Section 3: Recreate — restore custom preset, variable resolves
		//
		openMissingVariablePopover();
		clickMissingVariableRecreate();
		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-normal"]').should('exist');
		});
		expectBlockAttrStillBoundToVariable(config.blockAttrKey, config.slug);
		assertCustomPresetInGlobalStyles(config.id, {
			slug: config.slug,
			name: config.presetName,
		});
		if (config.assertRecreatedPresetValue !== false) {
			assertRecreatePresetHasStoredValue(config.id, config.slug);
		}
		config.assertRecreatedPresetFields?.();
		cy.realPress('Escape');

		//
		// Section 4: Re-break — delete preset again without full re-seed
		//
		removeCustomPresetFromGlobalStyles(config.id, config.slug);
		cy.getBlock(config.blockName || 'default').click({ force: true });
		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-deleted"]').should('exist');
		});

		//
		// Section 5: Unlink — convert binding to scalar on control
		//
		openMissingVariablePopover();
		clickMissingVariableUnlink();
		config.assertUnlinked?.();
	});
}

describe('Missing variable → recreate + unlink (consolidated per type)', () => {
	beforeEach(function () {
		skipWhenCustomPresetAddUnavailable.call(this);
	});

	runMissingVariableCombinedTest({
		id: 'color',
		presetName: 'E2E Missing Color',
		slug: 'e-2-e-missing-color',
		blockAttrKey: 'blockeraFontColor',
		seedPreset() {
			openGlobalStylesColorPaletteScreen();
			nameNewGlobalStylesCustomPreset({
				addDataTest: 'global-styles-preset-add-color-presets-custom',
				presetName: 'E2E Missing Color',
			});
			saveSiteEditorDirtyEntities();
		},
		setContainerAlias() {
			cy.getParentContainer('Text Color').as('container');
		},
		applyVariable() {
			cy.get('@container').within(() => {
				cy.openValueAddon();
			});
			cy.selectValueAddonItem('e-2-e-missing-color');
		},
		assertUnlinked() {
			getWPDataObject().then((data) => {
				const value = getSelectedBlock(data, 'blockeraFontColor');
				expect(value?.isValueAddon).to.not.equal(true);
			});
		},
	});

	runMissingVariableCombinedTest({
		id: 'font-size',
		presetName: 'E2E Missing FS',
		slug: 'e-2-e-missing-fs',
		blockAttrKey: 'blockeraFontSize',
		seedPreset() {
			openGlobalStylesFontSizesVariablesScreen();
			nameNewGlobalStylesCustomPreset({
				addDataTest:
					'global-styles-preset-add-font-size-presets-custom',
				presetName: 'E2E Missing FS',
			});
			saveSiteEditorDirtyEntities();
		},
		setContainerAlias() {
			cy.getParentContainer('Font Size').as('container');
		},
		applyVariable() {
			cy.get('@container').within(() => {
				cy.openValueAddon();
			});
			cy.selectValueAddonItem('e-2-e-missing-fs');
		},
		assertUnlinked() {
			expectBlockAttrIsScalarValueAddon('blockeraFontSize');
		},
	});

	runMissingVariableCombinedTest({
		id: 'spacing',
		presetName: 'E2E Missing Space',
		slug: 'e-2-e-missing-space',
		blockAttrKey: 'blockeraSpacing',
		seedPreset() {
			openGlobalStylesSpacingScreen();
			nameNewGlobalStylesCustomPreset({
				addDataTest:
					'global-styles-preset-add-spacing-size-presets-custom',
				presetName: 'E2E Missing Space',
			});
			saveSiteEditorDirtyEntities();
		},
		setContainerAlias() {
			cy.getParentContainer('Margin').as('container');
		},
		applyVariable() {
			setBoxSpacingSide('margin-top', 'e-2-e-missing-space', true);
		},
		assertUnlinked() {
			getWPDataObject().then((data) => {
				const spacing = getSelectedBlock(data, 'blockeraSpacing');
				expect(spacing?.margin?.top?.isValueAddon).to.not.equal(true);
			});
		},
	});

	runMissingVariableCombinedTest({
		id: 'width-size',
		presetName: 'E2E Missing Width',
		slug: 'e-2-e-missing-width',
		blockAttrKey: 'blockeraMinWidth',
		seedPreset() {
			openSiteEditor();
			injectCustomPresetRow('width-size', {
				slug: 'e-2-e-missing-width',
				name: 'E2E Missing Width',
				size: '320px',
				isVisible: true,
				deletable: true,
				cloneable: true,
				visibilitySupport: true,
			});
			saveSiteEditorDirtyEntities();
		},
		beforeApply() {
			cy.activateMoreSettingsItem('More Size Settings', 'Min Width');
		},
		setContainerAlias() {
			cy.getParentContainer('Min Width').as('container');
		},
		applyVariable() {
			cy.get('@container').within(() => {
				cy.openValueAddon();
			});
			cy.selectValueAddonItem('e-2-e-missing-width');
		},
		assertUnlinked() {
			expectBlockAttrIsScalarValueAddon('blockeraMinWidth');
		},
	});

	runMissingVariableCombinedTest({
		id: 'border-radius',
		presetName: 'E2E Missing Radius',
		slug: 'e-2-e-missing-radius',
		blockAttrKey: 'blockeraBorderRadius',
		seedPreset() {
			openSiteEditor();
			injectCustomPresetRow('border-radius', {
				slug: 'e-2-e-missing-radius',
				name: 'E2E Missing Radius',
				size: '14px',
				...CUSTOM_PRESET_ROW_META,
			});
			saveSiteEditorDirtyEntities();
		},
		setContainerAlias() {
			cy.getParentContainer('Border Radius').as('container');
		},
		applyVariable() {
			cy.get('@container').within(() => {
				cy.openValueAddon();
			});
			cy.selectValueAddonItem('e-2-e-missing-radius');
		},
		assertRecreatedPresetFields() {
			assertRecreatePresetRowFields(
				'border-radius',
				'e-2-e-missing-radius',
				{
					size: '14px',
				}
			);
		},
		assertUnlinked() {
			expectBlockAttrIsScalarValueAddon('blockeraBorderRadius');
		},
	});

	runMissingVariableCombinedTest({
		id: 'border',
		presetName: 'E2E Missing Border',
		slug: 'e-2-e-missing-border',
		blockAttrKey: 'blockeraBorder',
		seedPreset() {
			openSiteEditor();
			injectCustomPresetRow('border', {
				slug: 'e-2-e-missing-border',
				name: 'E2E Missing Border',
				border: {
					width: '3px',
					style: 'dotted',
					color: '#654321',
				},
				...CUSTOM_PRESET_ROW_META,
			});
			saveSiteEditorDirtyEntities();
		},
		setContainerAlias() {
			cy.getParentContainer('Border').as('container');
		},
		applyVariable() {
			cy.get('@container').within(() => {
				cy.openValueAddon(1);
			});
			cy.selectValueAddonItem('e-2-e-missing-border');
		},
		assertRecreatedPresetFields() {
			assertRecreatePresetRowFields('border', 'e-2-e-missing-border', {
				border: {
					width: '3px',
					style: 'dotted',
					color: '#654321',
				},
			});
		},
		assertUnlinked() {
			getWPDataObject().then((data) => {
				const border = getSelectedBlock(data, 'blockeraBorder');
				expect(border?.all?.color?.isValueAddon).to.not.equal(true);
			});
		},
	});

	runMissingVariableCombinedTest({
		id: 'shadow',
		presetName: 'E2E Missing Shadow',
		slug: 'e-2-e-missing-shadow',
		blockAttrKey: 'blockeraBoxShadow',
		seedPreset() {
			openSiteEditor();
			injectCustomPresetRow('shadow', {
				slug: 'e-2-e-missing-shadow',
				name: 'E2E Missing Shadow',
				items: [
					{
						type: 'outer',
						x: '12px',
						y: '8px',
						blur: '6px',
						spread: '0px',
						color: '#336699',
						isVisible: true,
					},
				],
				...CUSTOM_PRESET_ROW_META,
			});
			saveSiteEditorDirtyEntities();
		},
		setContainerAlias() {
			cy.getParentContainer('Box Shadows').as('container');
		},
		applyVariable() {
			openRepeaterHeaderVariablePicker('Box Shadows');
			cy.selectValueAddonItem('e-2-e-missing-shadow');
		},
		assertRecreatedPresetFields() {
			assertRecreatePresetRowFields('shadow', 'e-2-e-missing-shadow', {
				shadowContains: ['12px', '#336699'],
			});
		},
		assertUnlinked() {
			expectBlockAttrIsScalarValueAddon('blockeraBoxShadow');
		},
	});

	runMissingVariableCombinedTest({
		id: 'text-shadow',
		presetName: 'E2E Missing TShadow',
		slug: 'e-2-e-missing-tshadow',
		blockAttrKey: 'blockeraTextShadow',
		seedPreset() {
			openSiteEditor();
			injectCustomPresetRow('text-shadow', {
				slug: 'e-2-e-missing-tshadow',
				name: 'E2E Missing TShadow',
				items: [
					{
						x: '3px',
						y: '4px',
						blur: '5px',
						color: '#00aa88',
						isVisible: true,
					},
				],
				...CUSTOM_PRESET_ROW_META,
			});
			saveSiteEditorDirtyEntities();
		},
		beforeApply() {
			openMoreFeaturesControl('More typography settings');
		},
		setContainerAlias() {
			cy.getParentContainer('Text Shadows').as('container');
		},
		applyVariable() {
			openRepeaterHeaderVariablePicker('Text Shadows');
			cy.selectValueAddonItem('e-2-e-missing-tshadow');
		},
		assertRecreatedPresetFields() {
			assertRecreatePresetRowFields(
				'text-shadow',
				'e-2-e-missing-tshadow',
				{
					shadowContains: ['3px', '#00aa88'],
				}
			);
		},
		assertUnlinked() {
			expectBlockAttrIsScalarValueAddon('blockeraTextShadow');
		},
	});

	runMissingVariableCombinedTest({
		id: 'transform',
		presetName: 'E2E Missing Transform',
		slug: 'e-2-e-missing-transform',
		blockAttrKey: 'blockeraTransform',
		seedPreset() {
			openSiteEditor();
			injectCustomPresetRow('transform', {
				slug: 'e-2-e-missing-transform',
				name: 'E2E Missing Transform',
				items: [
					{
						type: 'move',
						'move-x': '20px',
						'move-y': '5px',
						'move-z': '0px',
						isVisible: true,
					},
				],
				...CUSTOM_PRESET_ROW_META,
			});
			saveSiteEditorDirtyEntities();
		},
		setContainerAlias() {
			cy.getParentContainer('Transforms').as('container');
		},
		applyVariable() {
			openRepeaterHeaderVariablePicker('Transforms');
			cy.selectValueAddonItem('e-2-e-missing-transform');
		},
		assertRecreatedPresetFields() {
			assertRecreatePresetRowFields(
				'transform',
				'e-2-e-missing-transform',
				{
					itemsLength: 1,
					itemsMatch: {
						type: 'move',
						'move-x': '20px',
						'move-y': '5px',
					},
				}
			);
		},
		assertUnlinked() {
			expectBlockAttrIsScalarValueAddon('blockeraTransform');
		},
	});

	runMissingVariableCombinedTest({
		id: 'transition',
		presetName: 'E2E Missing Transition',
		slug: 'e-2-e-missing-transition',
		blockAttrKey: 'blockeraTransition',
		seedPreset() {
			openSiteEditor();
			injectCustomPresetRow('transition', {
				slug: 'e-2-e-missing-transition',
				name: 'E2E Missing Transition',
				items: [
					{
						type: 'opacity',
						duration: '400ms',
						timing: 'ease-in',
						delay: '25ms',
						isVisible: true,
					},
				],
				...CUSTOM_PRESET_ROW_META,
			});
			saveSiteEditorDirtyEntities();
		},
		setContainerAlias() {
			cy.getParentContainer('Transition').as('container');
		},
		applyVariable() {
			openRepeaterHeaderVariablePicker('Transition');
			cy.selectValueAddonItem('e-2-e-missing-transition');
		},
		assertRecreatedPresetFields() {
			assertRecreatePresetRowFields(
				'transition',
				'e-2-e-missing-transition',
				{
					itemsLength: 1,
					itemsMatch: {
						type: 'opacity',
						duration: '400ms',
						timing: 'ease-in',
						delay: '25ms',
					},
				}
			);
		},
		assertUnlinked() {
			expectBlockAttrIsScalarValueAddon('blockeraTransition');
		},
	});

	runMissingVariableCombinedTest({
		id: 'filter',
		presetName: 'E2E Missing Filter',
		slug: 'e-2-e-missing-filter',
		blockAttrKey: 'blockeraFilter',
		seedPreset() {
			openSiteEditor();
			injectCustomPresetRow('filter', {
				slug: 'e-2-e-missing-filter',
				name: 'E2E Missing Filter',
				items: [{ type: 'blur', blur: '8px', isVisible: true }],
				...CUSTOM_PRESET_ROW_META,
			});
			saveSiteEditorDirtyEntities();
		},
		setContainerAlias() {
			cy.getParentContainer('Filters').as('container');
		},
		applyVariable() {
			openRepeaterHeaderVariablePicker('Filters');
			cy.selectValueAddonItem('e-2-e-missing-filter');
		},
		assertRecreatedPresetFields() {
			assertRecreatePresetRowFields('filter', 'e-2-e-missing-filter', {
				itemsLength: 1,
				itemsMatch: { type: 'blur', blur: '8px' },
			});
		},
		assertUnlinked() {
			expectBlockAttrIsScalarValueAddon('blockeraFilter');
		},
	});

	runMissingVariableCombinedTest({
		id: 'linear-gradient',
		presetName: 'E2E Missing LinGrad',
		slug: 'e-2-e-missing-lingrad',
		blockAttrKey: 'blockeraBackground',
		seedPreset() {
			openGlobalStylesLinearGradientsScreen();
			nameNewGlobalStylesCustomPreset({
				addDataTest:
					'global-styles-preset-add-linear-gradient-presets-custom',
				presetName: 'E2E Missing LinGrad',
			});
			saveSiteEditorDirtyEntities();
		},
		beforeApply() {
			cy.getParentContainer('Image & Gradient').within(() => {
				cy.getByAriaLabel('Add New Background').click({ force: true });
			});
		},
		setContainerAlias() {
			cy.get('.blockera-component-popover')
				.filter(':visible')
				.last()
				.within(() => {
					cy.getParentContainer('Linear Gradient')
						.last()
						.as('container');
				});
		},
		applyVariable() {
			cy.get('@container').within(() => {
				cy.openValueAddon();
			});
			cy.selectValueAddonItem('e-2-e-missing-lingrad');
		},
		assertUnlinked() {
			getWPDataObject().then((data) => {
				const bg = getSelectedBlock(data, 'blockeraBackground');
				const layer = bg?.['linear-gradient-0']?.['linear-gradient'];
				expect(layer?.isValueAddon).to.not.equal(true);
			});
		},
	});

	runMissingVariableCombinedTest({
		id: 'radial-gradient',
		presetName: 'E2E Missing RadGrad',
		slug: 'e-2-e-missing-radgrad',
		blockAttrKey: 'blockeraBackground',
		seedPreset() {
			openGlobalStylesRadialGradientsScreen();
			nameNewGlobalStylesCustomPreset({
				addDataTest:
					'global-styles-preset-add-radial-gradient-presets-custom',
				presetName: 'E2E Missing RadGrad',
			});
			saveSiteEditorDirtyEntities();
		},
		beforeApply() {
			cy.getParentContainer('Image & Gradient').within(() => {
				cy.getByAriaLabel('Add New Background').click({ force: true });
			});
			cy.get('.blockera-component-popover')
				.filter(':visible')
				.last()
				.within(() => {
					cy.contains('button', /radial gradient/i).click({
						force: true,
					});
				});
		},
		setContainerAlias() {
			cy.get('.blockera-component-popover')
				.filter(':visible')
				.last()
				.within(() => {
					cy.getParentContainer('Radial Gradient')
						.last()
						.as('container');
				});
		},
		applyVariable() {
			cy.get('@container').within(() => {
				cy.openValueAddon();
			});
			cy.selectValueAddonItem('e-2-e-missing-radgrad');
		},
		assertUnlinked() {
			getWPDataObject().then((data) => {
				const bg = getSelectedBlock(data, 'blockeraBackground');
				const layer = bg?.['radial-gradient-0']?.['radial-gradient'];
				expect(layer?.isValueAddon).to.not.equal(true);
			});
		},
	});

	it('missing variable without cached value — hides unlink and recreate', () => {
		//
		// Section 1: font-size binding with no cached settings.value
		//
		createPost();
		appendBlocks(
			'<!-- wp:paragraph {"blockeraFontSize":{"isValueAddon":true,"valueType":"variable","name":"Missing FS","settings":{"id":"missing-fs-empty","name":"Missing FS","type":"font-size","var":"--wp--preset--font-size--missing-fs-empty"}}} -->' +
				'<p>Missing font size without cached value</p>' +
				'<!-- /wp:paragraph -->'
		);
		cy.getBlock('core/paragraph').first().click();
		cy.getParentContainer('Font Size').as('container');
		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-deleted"]').should('exist');
		});
		openMissingVariablePopover();
		assertMissingVariableActions({
			unlink: false,
			recreate: false,
			remove: true,
		});
		cy.realPress('Escape');

		//
		// Section 2: color binding with no cached settings.value on second block
		//
		appendBlocks(
			'<!-- wp:paragraph {"blockeraFontColor":{"isValueAddon":true,"valueType":"variable","name":"Missing Color","settings":{"id":"missing-color-empty","name":"Missing Color","type":"color","var":"--wp--preset--color--missing-color-empty"}}} -->' +
				'<p>Missing color without cached value</p>' +
				'<!-- /wp:paragraph -->'
		);
		cy.getBlock('core/paragraph').last().click();
		cy.getParentContainer('Text Color').as('container');
		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-deleted"]').should('exist');
		});
		openMissingVariablePopover();
		assertMissingVariableActions({
			unlink: false,
			recreate: false,
			remove: true,
		});
		cy.realPress('Escape');

		//
		// Section 3: transform without cached settings.value
		//
		appendMissingVariableBlockWithoutCachedValue({
			attrKey: 'blockeraTransform',
			variableType: 'transform',
			id: 'missing-transform-empty',
			name: 'Missing Transform',
			varCssVar: '--wp--preset--transform--missing-transform-empty',
			blockContent: 'Missing transform without cached value',
		});
		cy.getBlock('core/paragraph').last().click();
		cy.getByAriaControls('styles-view').click();
		cy.getParentContainer('Transforms').as('container');
		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-deleted"]').should('exist');
		});
		openMissingVariablePopover();
		assertMissingVariableActions({
			unlink: false,
			recreate: false,
			remove: true,
		});
		cy.realPress('Escape');

		//
		// Section 4: box-shadow without cached settings.value
		//
		appendMissingVariableBlockWithoutCachedValue({
			attrKey: 'blockeraBoxShadow',
			variableType: 'shadow',
			id: 'missing-shadow-empty',
			name: 'Missing Shadow',
			varCssVar: '--wp--preset--shadow--missing-shadow-empty',
			blockContent: 'Missing shadow without cached value',
		});
		cy.getBlock('core/paragraph').last().click();
		cy.getByAriaControls('styles-view').click();
		cy.getParentContainer('Box Shadows').as('container');
		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-deleted"]').should('exist');
		});
		openMissingVariablePopover();
		assertMissingVariableActions({
			unlink: false,
			recreate: false,
			remove: true,
		});
		cy.realPress('Escape');

		//
		// Section 5: border-radius without cached settings.value
		//
		appendMissingVariableBlockWithoutCachedValue({
			attrKey: 'blockeraBorderRadius',
			variableType: 'border-radius',
			id: 'missing-radius-empty',
			name: 'Missing Radius',
			varCssVar: '--wp--preset--border-radius--missing-radius-empty',
			blockContent: 'Missing border radius without cached value',
		});
		cy.getBlock('core/paragraph').last().click();
		cy.getByAriaControls('styles-view').click();
		cy.getParentContainer('Border Radius').as('container');
		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-deleted"]').should('exist');
		});
		openMissingVariablePopover();
		assertMissingVariableActions({
			unlink: false,
			recreate: false,
			remove: true,
		});
	});
});

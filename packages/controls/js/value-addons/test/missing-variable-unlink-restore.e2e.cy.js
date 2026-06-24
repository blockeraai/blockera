/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	getSelectedBlock,
	getWPDataObject,
	openMoreFeaturesControl,
	openRepeaterHeaderVariablePicker,
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
	openMissingVariablePopover,
	removeCustomPresetFromGlobalStyles,
	seedCustomPresetAndOpenPostEditor,
} from '@blockera/dev-cypress/js/helpers/missing-variable';

function ensureStylesViewOpen() {
	cy.getByAriaControls('styles-view', { timeout: 20000 }).then(($btn) => {
		if ($btn.attr('aria-expanded') !== 'true') {
			cy.wrap($btn).click();
		}
	});
}

function closeOverlayPopover() {
	cy.realPress('Escape');
}

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
		cy.getBlock(config.blockName || 'default').type(
			`${config.id} missing variable paragraph.`,
			{ delay: 0 }
		);
		ensureStylesViewOpen();
		config.beforeApply?.();
		config.setContainerAlias?.();
		config.applyVariable();
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
		closeOverlayPopover();

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
		closeOverlayPopover();

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
	runMissingVariableCombinedTest({
		id: 'color',
		presetName: 'E2E Missing Color',
		slug: 'e-2-e-missing-color',
		blockAttrKey: 'blockeraFontColor',
		seedPreset() {
			seedCustomPresetAndOpenPostEditor('color', {
				slug: 'e-2-e-missing-color',
				name: 'E2E Missing Color',
				color: '#336699',
				...CUSTOM_PRESET_ROW_META,
			});
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
			seedCustomPresetAndOpenPostEditor('font-size', {
				slug: 'e-2-e-missing-fs',
				name: 'E2E Missing FS',
				size: '18px',
				...CUSTOM_PRESET_ROW_META,
			});
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
			seedCustomPresetAndOpenPostEditor('spacing', {
				slug: 'e-2-e-missing-space',
				name: 'E2E Missing Space',
				size: '24px',
				...CUSTOM_PRESET_ROW_META,
			});
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
			seedCustomPresetAndOpenPostEditor('width-size', {
				slug: 'e-2-e-missing-width',
				name: 'E2E Missing Width',
				size: '320px',
				isVisible: true,
				deletable: true,
				cloneable: true,
				visibilitySupport: true,
			});
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
			seedCustomPresetAndOpenPostEditor('border-radius', {
				slug: 'e-2-e-missing-radius',
				name: 'E2E Missing Radius',
				size: '14px',
				...CUSTOM_PRESET_ROW_META,
			});
		},
		setContainerAlias() {
			cy.getParentContainer('Radius').as('container');
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
			seedCustomPresetAndOpenPostEditor('border', {
				slug: 'e-2-e-missing-border',
				name: 'E2E Missing Border',
				border: {
					width: '3px',
					style: 'dotted',
					color: '#654321',
				},
				...CUSTOM_PRESET_ROW_META,
			});
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
			seedCustomPresetAndOpenPostEditor('shadow', {
				slug: 'e-2-e-missing-shadow',
				name: 'E2E Missing Shadow',
				shadow: '12px 8px 6px 0px #336699',
				...CUSTOM_PRESET_ROW_META,
			});
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
				shadowContains: ['10px', '#000000ab'],
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
			seedCustomPresetAndOpenPostEditor('text-shadow', {
				slug: 'e-2-e-missing-tshadow',
				name: 'E2E Missing TShadow',
				shadow: '3px 4px 5px #00aa88',
				...CUSTOM_PRESET_ROW_META,
			});
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
					shadowContains: ['1px', '#000000ab'],
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
			seedCustomPresetAndOpenPostEditor('transform', {
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
			seedCustomPresetAndOpenPostEditor('transition', {
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
		},
		setContainerAlias() {
			cy.getParentContainer(['Transitions Timing', 'Transitions']).as(
				'container'
			);
		},
		applyVariable() {
			openRepeaterHeaderVariablePicker([
				'Transitions Timing',
				'Transitions',
			]);
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
			seedCustomPresetAndOpenPostEditor('filter', {
				slug: 'e-2-e-missing-filter',
				name: 'E2E Missing Filter',
				items: [{ type: 'blur', blur: '8px', isVisible: true }],
				...CUSTOM_PRESET_ROW_META,
			});
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
		cy.getBlock('core/paragraph').last().click({ force: true });
		ensureStylesViewOpen();
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
		cy.getBlock('core/paragraph').last().click({ force: true });
		ensureStylesViewOpen();
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
	});
});

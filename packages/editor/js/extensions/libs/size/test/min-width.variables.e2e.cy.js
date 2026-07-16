/**
 * Blockera dependencies
 */
import {
	assertVariablePickerPresetHoverPreview,
	createPost,
	filterVariablePickerSearch,
	getSelectedBlock,
	getWPDataObject,
	nameNewGlobalStylesCustomPreset,
	openGlobalStylesSpacingScreen,
	resetAndSaveGlobalStylesEntityRecord,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';
import {
	assertCustomPresetEditPopoverFieldValue,
	clickVariablePickerSectionAddCustomVariable,
	getVariablePickerPopoverBody,
	withinVariablePickerPopover,
} from '@blockera/dev-cypress/js/helpers/variable-picker';

function openMinWidthPickerAfterSeedingValue(value) {
	createPost();

	cy.getBlock('default').type('Min width variable picker.', { delay: 0 });
	cy.getByAriaControls('styles-view').click();
	cy.activateMoreSettingsItem('More Size Settings', 'Min Width');

	if (value !== undefined && value !== null && value !== '') {
		cy.getParentContainer('Min Width').within(() => {
			cy.get('input').clear();
			cy.get('input').type(String(value), { force: true });
		});
	}

	cy.getParentContainer('Min Width').within(() => {
		cy.openValueAddon();
	});

	cy.getByDataTest('variable-picker-popover', { timeout: 20000 })
		.filter(':visible')
		.first()
		.should('be.visible');
}

describe('Min Width variable picker → hover canvas preview', () => {
	const presetName = 'E2E Min Width Spacing';
	/** Matches `normalizeVariablePresetSlug` for the preset display name. */
	const slug = 'e-2-e-min-width-spacing';
	const addDataTest = 'global-styles-preset-add-spacing-size-presets-custom';
	const defaultFallback = '20px';

	afterEach(() => {
		resetAndSaveGlobalStylesEntityRecord();
	});

	function seedSpacingPreset() {
		openGlobalStylesSpacingScreen();
		nameNewGlobalStylesCustomPreset({ addDataTest, presetName });
		saveSiteEditorDirtyEntities();
	}

	it('previews the spacing preset as min-width on the selected block while hovering the picker row, then clears it on mouse leave', () => {
		seedSpacingPreset();

		openMinWidthPickerAfterSeedingValue('');

		filterVariablePickerSearch(presetName);

		assertVariablePickerPresetHoverPreview({
			slug,
			cssNeedle: `min-width: ${defaultFallback}`,
			blockCssProperty: 'min-width',
			blockCssValue: defaultFallback,
		});
	});
});

describe('Min Width variable picker → multi-type custom preset add', () => {
	it('shows section add buttons and type-specific custom labels', () => {
		openMinWidthPickerAfterSeedingValue('');

		withinVariablePickerPopover(() => {
			cy.getByDataTest(
				'variable-picker-header-add-custom-variable'
			).should('not.exist');

			cy.getByDataTest('variable-picker-section-add-width-size').should(
				'exist'
			);
			cy.getByDataTest('variable-picker-section-add-spacing').should(
				'exist'
			);

			cy.contains('Width & Height Variables').should('exist');
			cy.contains('Spacing Variables').should('not.exist');
			cy.contains('Custom Width Size variables').should('exist');
			cy.contains('Custom Spacing Size variables').should('exist');
		});
	});

	it('adds a custom spacing preset via the spacing section add button', function () {
		openMinWidthPickerAfterSeedingValue('48');

		withinVariablePickerPopover(() => {
			cy.contains('Custom Spacing Size variables').scrollIntoView();
		});

		getVariablePickerPopoverBody().scrollTo('bottom', {
			duration: 0,
			ensureScrollable: false,
		});

		cy.getByDataTest('variable-picker-section-add-spacing', {
			timeout: 20000,
		})
			.first()
			.click({ force: true });

		cy.get(
			'[data-test="repeater-item-creating-step"], [data-cy="blockera-repeater-promo"], [data-cy="blockera-modal"]',
			{ timeout: 20000 }
		).then(($el) => {
			const dataCy = $el.attr('data-cy');
			const dataTest = $el.attr('data-test');

			if (
				dataCy === 'blockera-repeater-promo' ||
				dataCy === 'blockera-modal'
			) {
				// @debug-ignore
				this.skip();
			}

			if (dataTest !== 'repeater-item-creating-step') {
				// @debug-ignore
				this.skip();
			}

			assertCustomPresetEditPopoverFieldValue('Size', '48');

			cy.then({ timeout: 15000 }, () =>
				getWPDataObject().then((data) => {
					const minWidth = getSelectedBlock(data, 'blockeraMinWidth');
					expect(minWidth.isValueAddon).to.equal(true);
					expect(minWidth.valueType).to.equal('variable');
					expect(minWidth.settings?.type).to.equal('spacing');
					expect(minWidth.settings?.reference?.type).to.equal(
						'custom'
					);
					expect(minWidth.settings?.value).to.equal('48px');
				})
			);
		});
	});

	it('adds a custom width-size preset via the width-size section add button', () => {
		openMinWidthPickerAfterSeedingValue('320');

		clickVariablePickerSectionAddCustomVariable('width-size');

		assertCustomPresetEditPopoverFieldValue('Size', '320');

		cy.then({ timeout: 15000 }, () =>
			getWPDataObject().then((data) => {
				const minWidth = getSelectedBlock(data, 'blockeraMinWidth');
				expect(minWidth.isValueAddon).to.equal(true);
				expect(minWidth.valueType).to.equal('variable');
				expect(minWidth.settings?.type).to.equal('width-size');
				expect(minWidth.settings?.reference?.type).to.equal('custom');
				expect(minWidth.settings?.value).to.equal('320px');
			})
		);
	});
});

/**
 * E2E coverage for advanced variable-picker search (multi-word AND + CSS value matching).
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';
import {
	assertColorPresetNotInVariablePicker,
	assertColorPresetVisibleInVariablePicker,
	clearVariablePickerSearch,
	getWPDataObject,
	MU_FIX,
	openColorVariablePickerSearchTestPopover,
	typeInVariablePickerSearch,
} from './e2e-variable-variations-helpers';

const MU = `${MU_FIX}/e2e-color-variable-picker-search.php`;
const MU_NAME = 'e2e-color-variable-picker-search.php';

const PRESET_ON_BRAND = 'Base / Primary / On Brand';
const PRESET_ACCENT = 'Accent / Secondary Tone';
const PRESET_NEUTRAL = 'Neutral Surface';

/** Leaf labels shown in the picker when search is inactive (taxonomy display names). */
const PRESET_ON_BRAND_DISPLAY = 'On Brand';
const PRESET_ACCENT_DISPLAY = 'Secondary Tone';
const PRESET_NEUTRAL_DISPLAY = 'Neutral Surface';

describe('Global Styles UI → Color variable picker search', () => {
	beforeEach(() => {
		return activateMuPlugin(MU, MU_NAME);
	});

	afterEach(() => {
		return deactivateMuPlugin(MU, MU_NAME);
	});

	it('shows all fixture presets when search is empty', () => {
		openColorVariablePickerSearchTestPopover();

		assertColorPresetVisibleInVariablePicker(PRESET_ON_BRAND_DISPLAY);
		assertColorPresetVisibleInVariablePicker(PRESET_ACCENT_DISPLAY);
		assertColorPresetVisibleInVariablePicker(PRESET_NEUTRAL_DISPLAY);
	});

	it('filters with multi-word AND search (bas bran)', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch('bas bran');

		assertColorPresetVisibleInVariablePicker(PRESET_ON_BRAND);
		assertColorPresetNotInVariablePicker(PRESET_ACCENT_DISPLAY);
		assertColorPresetNotInVariablePicker(PRESET_NEUTRAL_DISPLAY);
	});

	it('filters with multi-word partial search (acc sec)', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch('acc sec');

		assertColorPresetNotInVariablePicker(PRESET_ON_BRAND);
		assertColorPresetVisibleInVariablePicker(PRESET_ACCENT);
		assertColorPresetNotInVariablePicker(PRESET_NEUTRAL);
	});

	it('filters by CSS value fragment (aabb)', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch('aabb');

		assertColorPresetVisibleInVariablePicker(PRESET_ON_BRAND);
		assertColorPresetNotInVariablePicker(PRESET_ACCENT_DISPLAY);
		assertColorPresetNotInVariablePicker(PRESET_NEUTRAL_DISPLAY);
	});

	it('shows unified empty state when no presets match', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch('bas xyz');

		assertColorPresetNotInVariablePicker(PRESET_ON_BRAND);
		assertColorPresetNotInVariablePicker(PRESET_ACCENT_DISPLAY);
		assertColorPresetNotInVariablePicker(PRESET_NEUTRAL_DISPLAY);

		cy.getByDataTest('variable-picker-popover')
			.filter(':visible')
			.first()
			.within(() => {
				cy.getByDataTest('var-picker-search-empty').should(
					'be.visible'
				);
				cy.contains('No results for "bas xyz"').should('be.visible');
				cy.contains('Clear search').should('be.visible');
				cy.contains('No variables match your search.').should(
					'not.exist'
				);
			});

		cy.getByDataTest('variable-picker-popover')
			.filter(':visible')
			.first()
			.within(() => {
				cy.getByDataTest('var-picker-summary-slot').should(
					'not.be.visible'
				);
			});
	});

	it('clears search from the empty-state button', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch('bas xyz');

		cy.getByDataTest('variable-picker-popover')
			.filter(':visible')
			.first()
			.within(() => {
				cy.contains('button', 'Clear search').click({ force: true });
			});

		assertColorPresetVisibleInVariablePicker(PRESET_ON_BRAND_DISPLAY);
		assertColorPresetVisibleInVariablePicker(PRESET_ACCENT_DISPLAY);
		assertColorPresetVisibleInVariablePicker(PRESET_NEUTRAL_DISPLAY);
	});

	it('restores all presets after clearing search', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch('bas bran');
		assertColorPresetVisibleInVariablePicker(PRESET_ON_BRAND);
		assertColorPresetNotInVariablePicker(PRESET_ACCENT);

		clearVariablePickerSearch();

		assertColorPresetVisibleInVariablePicker(PRESET_ON_BRAND_DISPLAY);
		assertColorPresetVisibleInVariablePicker(PRESET_ACCENT_DISPLAY);
		assertColorPresetVisibleInVariablePicker(PRESET_NEUTRAL_DISPLAY);
	});

	it('selects a filtered preset by slug', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch('bas bran');

		assertColorPresetVisibleInVariablePicker(PRESET_ON_BRAND);

		cy.selectValueAddonItem('e-2-e-search-on-brand');

		getWPDataObject().then((data) => {
			const fontColor = getSelectedBlock(data, 'blockeraFontColor');

			expect(fontColor.settings.var).to.equal(
				'--wp--preset--color--e-2-e-search-on-brand'
			);
		});
	});
});

/**
 * E2E coverage for advanced variable-picker search (multi-word AND + CSS value matching).
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';
import { clearPresetVariablesViewModeStorage } from '@blockera/dev-cypress/js/helpers/preset-variables-view';
import {
	assertColorPresetSlugNotInVariablePicker,
	assertColorPresetSlugVisibleInVariablePicker,
	clearVariablePickerSearch,
	getWPDataObject,
	MU_FIX,
	openColorVariablePickerSearchTestPopover,
	typeInVariablePickerSearch,
} from './e2e-variable-variations-helpers';

const MU = `${MU_FIX}/e2e-color-variable-picker-search.php`;
const MU_NAME = 'e2e-color-variable-picker-search.php';

const SLUG_ON_BRAND = 'e-2-e-search-on-brand';
const SLUG_ACCENT = 'e-2-e-search-accent';
const SLUG_NEUTRAL = 'e-2-e-search-neutral';

/** Search queries scoped to MU fixture names/values (not theme palette). */
const SEARCH_ON_BRAND = 'e2e bran';
const SEARCH_ACCENT = 'e2e accent';
const SEARCH_HEX = 'aabb';
const SEARCH_NO_MATCH = 'e2e xyz';

describe('Global Styles UI → Color variable picker search', () => {
	before(() => {
		return activateMuPlugin(MU, MU_NAME);
	});

	after(() => {
		return deactivateMuPlugin(MU, MU_NAME);
	});

	beforeEach(() => {
		clearPresetVariablesViewModeStorage();
	});

	it('shows all fixture presets when search is empty', () => {
		openColorVariablePickerSearchTestPopover();

		assertColorPresetSlugVisibleInVariablePicker(SLUG_ON_BRAND);
		assertColorPresetSlugVisibleInVariablePicker(SLUG_ACCENT);
		assertColorPresetSlugVisibleInVariablePicker(SLUG_NEUTRAL);
	});

	it('filters with multi-word AND search (e2e bran)', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch(SEARCH_ON_BRAND);

		assertColorPresetSlugVisibleInVariablePicker(SLUG_ON_BRAND);
		assertColorPresetSlugNotInVariablePicker(SLUG_ACCENT);
		assertColorPresetSlugNotInVariablePicker(SLUG_NEUTRAL);
	});

	it('filters with multi-word partial search (e2e accent)', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch(SEARCH_ACCENT);

		assertColorPresetSlugNotInVariablePicker(SLUG_ON_BRAND);
		assertColorPresetSlugVisibleInVariablePicker(SLUG_ACCENT);
		assertColorPresetSlugNotInVariablePicker(SLUG_NEUTRAL);
	});

	it('filters by CSS value fragment (aabb)', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch(SEARCH_HEX);

		assertColorPresetSlugVisibleInVariablePicker(SLUG_ON_BRAND);
		assertColorPresetSlugNotInVariablePicker(SLUG_ACCENT);
		assertColorPresetSlugNotInVariablePicker(SLUG_NEUTRAL);
	});

	it('shows unified empty state when no presets match', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch(SEARCH_NO_MATCH);

		assertColorPresetSlugNotInVariablePicker(SLUG_ON_BRAND);
		assertColorPresetSlugNotInVariablePicker(SLUG_ACCENT);
		assertColorPresetSlugNotInVariablePicker(SLUG_NEUTRAL);

		cy.getByDataTest('variable-picker-popover')
			.filter(':visible')
			.first()
			.within(() => {
				cy.getByDataTest('var-picker-search-empty').should(
					'be.visible'
				);
				cy.contains(`No results for "${SEARCH_NO_MATCH}"`).should(
					'be.visible'
				);
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

		typeInVariablePickerSearch(SEARCH_NO_MATCH);

		cy.getByDataTest('variable-picker-popover')
			.filter(':visible')
			.first()
			.within(() => {
				cy.contains('button', 'Clear search').click({ force: true });
			});

		assertColorPresetSlugVisibleInVariablePicker(SLUG_ON_BRAND);
		assertColorPresetSlugVisibleInVariablePicker(SLUG_ACCENT);
		assertColorPresetSlugVisibleInVariablePicker(SLUG_NEUTRAL);
	});

	it('restores all presets after clearing search', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch(SEARCH_ON_BRAND);
		assertColorPresetSlugVisibleInVariablePicker(SLUG_ON_BRAND);
		assertColorPresetSlugNotInVariablePicker(SLUG_ACCENT);

		clearVariablePickerSearch();

		assertColorPresetSlugVisibleInVariablePicker(SLUG_ON_BRAND);
		assertColorPresetSlugVisibleInVariablePicker(SLUG_ACCENT);
		assertColorPresetSlugVisibleInVariablePicker(SLUG_NEUTRAL);
	});

	it('selects a filtered preset by slug', () => {
		openColorVariablePickerSearchTestPopover();

		typeInVariablePickerSearch(SEARCH_ON_BRAND);

		assertColorPresetSlugVisibleInVariablePicker(SLUG_ON_BRAND);

		cy.selectValueAddonItem(SLUG_ON_BRAND);

		getWPDataObject().then((data) => {
			const fontColor = getSelectedBlock(data, 'blockeraFontColor');

			expect(fontColor.settings.var).to.equal(
				'--wp--preset--color--e-2-e-search-on-brand'
			);
		});
	});
});

/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	openGlobalStylesColorPaletteScreen,
} from '@blockera/dev-cypress/js/helpers';
import {
	clearPresetVariablesViewModeStorage,
	expectPresetTaxonomyGroupedHidden,
	expectPresetTaxonomyGroupedVisible,
	expectPresetVariablesCount,
	expectPresetVariablesViewModeSelectVisible,
	expectPresetVariablesViewModeStorage,
	getPresetVariablesSummaryRow,
	setPresetVariablesViewMode,
} from '@blockera/dev-cypress/js/helpers/preset-variables-view';
import {
	clearVariablePickerSearch,
	openParagraphTextColorVariablePickerPopover,
	typeInVariablePickerSearch,
	withinVariablePickerPopover,
} from '../colors/test/e2e-variable-variations-helpers';

const MU_FIX = 'packages/global-styles-ui/js/colors/test/fixtures';

describe('Preset variables view mode (grouped/list)', () => {
	beforeEach(() => {
		clearPresetVariablesViewModeStorage();
	});

	describe('site editor color screen with taxonomy groups', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-mixed-simple.php`;
		const MU_NAME = 'e2e-color-taxonomy-mixed-simple.php';

		beforeEach(() => {
			return activateMuPlugin(MU, MU_NAME);
		});

		afterEach(() => {
			return deactivateMuPlugin(MU, MU_NAME);
		});

		it('shows variable count and grouped/list select with taxonomy UI by default', () => {
			openGlobalStylesColorPaletteScreen();

			getPresetVariablesSummaryRow().should('be.visible');
			expectPresetVariablesCount(2);
			expectPresetVariablesViewModeSelectVisible(true);
			expectPresetTaxonomyGroupedVisible();
		});

		it('switches to list view and hides taxonomy groups', () => {
			openGlobalStylesColorPaletteScreen();

			setPresetVariablesViewMode('list');
			expectPresetVariablesViewModeStorage('list');
			expectPresetTaxonomyGroupedHidden();
			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Mixed Leaf',
				{
					timeout: 20000,
				}
			).should('be.visible');
		});

		it('persists list view after reload', () => {
			openGlobalStylesColorPaletteScreen();
			setPresetVariablesViewMode('list');
			expectPresetVariablesViewModeStorage('list');

			cy.reload();
			openGlobalStylesColorPaletteScreen();

			expectPresetVariablesViewModeStorage('list');
			expectPresetTaxonomyGroupedHidden();
		});
	});

	describe('list view forces full-width repeater rows (skips interface-size small)', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-category.php`;
		const MU_NAME = 'e2e-color-taxonomy-category.php';

		beforeEach(() => {
			return activateMuPlugin(MU, MU_NAME);
		});

		afterEach(() => {
			return deactivateMuPlugin(MU, MU_NAME);
		});

		it('renders interface-size small presets as full rows in list view', () => {
			openGlobalStylesColorPaletteScreen();

			setPresetVariablesViewMode('list');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Small Slot',
				{ timeout: 20000 }
			)
				.closest('[data-cy="repeater-item"]')
				.should('not.have.class', 'is-small')
				.and(
					'not.have.class',
					'blockera-preset-taxonomy-row--interface-small'
				);
		});
	});

	describe('site editor color screen without taxonomy groups', () => {
		const MU = `${MU_FIX}/e2e-color-variations-no-taxonomy.php`;
		const MU_NAME = 'e2e-color-variations-no-taxonomy.php';

		beforeEach(() => {
			return activateMuPlugin(MU, MU_NAME);
		});

		afterEach(() => {
			return deactivateMuPlugin(MU, MU_NAME);
		});

		it('shows count but hides grouped/list select when presets are flat only', () => {
			openGlobalStylesColorPaletteScreen();

			getPresetVariablesSummaryRow().should('be.visible');
			expectPresetVariablesCount(1);
			expectPresetVariablesViewModeSelectVisible(false);
		});
	});

	describe('variable picker with taxonomy groups', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-mixed-simple.php`;
		const MU_NAME = 'e2e-color-taxonomy-mixed-simple.php';

		beforeEach(() => {
			return activateMuPlugin(MU, MU_NAME);
		});

		afterEach(() => {
			return deactivateMuPlugin(MU, MU_NAME);
		});

		it('shows summary row and switches to list view inside the picker', () => {
			openParagraphTextColorVariablePickerPopover();

			withinVariablePickerPopover(() => {
				getPresetVariablesSummaryRow().should('be.visible');
				expectPresetVariablesCount(2);
				expectPresetVariablesViewModeSelectVisible(true);
				expectPresetTaxonomyGroupedVisible();

				setPresetVariablesViewMode('list');
				expectPresetTaxonomyGroupedHidden();
				cy.contains(
					'[data-cy="color-repeater-item-header"] [data-cy="header-label"]',
					'E2E Tax Mixed Group/E2E Tax Mixed Category/E2E Tax Mixed Leaf',
					{ timeout: 20000 }
				).should('be.visible');
			});
		});

		it('hides view select during search and shows filtered match count', () => {
			openParagraphTextColorVariablePickerPopover();

			typeInVariablePickerSearch('Mixed Leaf');

			withinVariablePickerPopover(() => {
				expectPresetVariablesViewModeSelectVisible(false);
				expectPresetVariablesCount(1);
			});

			clearVariablePickerSearch();

			withinVariablePickerPopover(() => {
				expectPresetVariablesViewModeSelectVisible(true);
				expectPresetVariablesCount(2);
			});
		});
	});
});

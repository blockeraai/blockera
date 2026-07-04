/**
 * Minimal E2E smoke: preset taxonomy grouping per variable type.
 * Full color taxonomy coverage lives in colors/test/color-palette-taxonomy-variations.global-styles.e2e.cy.js
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
} from '@blockera/dev-cypress/js/helpers';
import {
	assertPresetTaxonomyGroupShell,
	openGlobalStylesBorderRadiusScreen,
	openGlobalStylesBordersScreen,
	openGlobalStylesFiltersScreen,
	openGlobalStylesFontSizesVariablesScreen,
	openGlobalStylesLinearGradientsScreen,
	openGlobalStylesRadialGradientsScreen,
	openGlobalStylesShadowsScreen,
	openGlobalStylesSpacingScreen,
	openGlobalStylesTextShadowsScreen,
	openGlobalStylesTransformsScreen,
	openGlobalStylesTransitionsScreen,
} from '@blockera/dev-cypress/js/helpers/global-styles';

const FIX = 'packages/global-styles-ui/js/test/fixtures';

/**
 * @param {object} options
 * @param {string} options.fixture
 * @param {string} options.muName
 * @param {() => void} options.openScreen
 * @param {string} options.presetsSelector
 * @param {string} options.headerSelector
 */
function assertTaxonomySmoke({
	fixture,
	muName,
	openScreen,
	presetsSelector,
	headerSelector,
}) {
	describe(`taxonomy smoke (${muName})`, () => {
		const MU = `${FIX}/${fixture}`;

		beforeEach(() => {
			activateMuPlugin(MU, muName);
		});

		afterEach(() => {
			deactivateMuPlugin(MU, muName);
		});

		it('renders grouped taxonomy tree with leaf header label', () => {
			openScreen();

			cy.get(presetsSelector, { timeout: 20000 }).should('be.visible');
			cy.getByDataTest('preset-taxonomy-tree', { timeout: 20000 }).should(
				'be.visible'
			);
			assertPresetTaxonomyGroupShell('E2E Group', { exists: true });
			cy.contains(headerSelector, 'Tiny', { timeout: 20000 }).should(
				'be.visible'
			);
		});
	});
}

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-spacing.php',
	muName: 'e2e-preset-taxonomy-spacing.php',
	openScreen: () => openGlobalStylesSpacingScreen(),
	presetsSelector: '.blockera-spacing-presets',
	headerSelector: '[data-cy="spacing-size-repeater-item-header"]',
});

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-font-size.php',
	muName: 'e2e-preset-taxonomy-font-size.php',
	openScreen: () => openGlobalStylesFontSizesVariablesScreen(),
	presetsSelector: '.blockera-font-size-editor',
	headerSelector: '[data-cy="font-size-repeater-item-header"]',
});

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-border-radius.php',
	muName: 'e2e-preset-taxonomy-border-radius.php',
	openScreen: () => openGlobalStylesBorderRadiusScreen(),
	presetsSelector: '.blockera-border-radius-presets',
	headerSelector: '[data-cy="border-radius-preset-repeater-item-header"]',
});

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-border.php',
	muName: 'e2e-preset-taxonomy-border.php',
	openScreen: () => openGlobalStylesBordersScreen(),
	presetsSelector: '.blockera-borders-presets',
	headerSelector: '[data-cy="border-preset-repeater-item-header"]',
});

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-shadow.php',
	muName: 'e2e-preset-taxonomy-shadow.php',
	openScreen: () => openGlobalStylesShadowsScreen(),
	presetsSelector: '.blockera-shadows-editor',
	headerSelector: '[data-cy="shadow-preset-repeater-item-header"]',
});

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-text-shadow.php',
	muName: 'e2e-preset-taxonomy-text-shadow.php',
	openScreen: () => openGlobalStylesTextShadowsScreen(),
	presetsSelector: '.blockera-text-shadows-presets',
	headerSelector: '[data-cy="text-shadow-preset-repeater-item-header"]',
});

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-filter.php',
	muName: 'e2e-preset-taxonomy-filter.php',
	openScreen: () => openGlobalStylesFiltersScreen(),
	presetsSelector: '.blockera-filters-presets',
	headerSelector: '[data-cy="filter-preset-repeater-item-header"]',
});

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-transform.php',
	muName: 'e2e-preset-taxonomy-transform.php',
	openScreen: () => openGlobalStylesTransformsScreen(),
	presetsSelector: '.blockera-transforms-presets',
	headerSelector: '[data-cy="transform-preset-repeater-item-header"]',
});

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-transition.php',
	muName: 'e2e-preset-taxonomy-transition.php',
	openScreen: () => openGlobalStylesTransitionsScreen(),
	presetsSelector: '.blockera-transitions-presets',
	headerSelector: '[data-cy="transition-preset-repeater-item-header"]',
});

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-linear-gradient.php',
	muName: 'e2e-preset-taxonomy-linear-gradient.php',
	openScreen: () => openGlobalStylesLinearGradientsScreen(),
	presetsSelector: '.blockera-linear-gradients-presets',
	headerSelector: '[data-cy="gradient-repeater-item-header"]',
});

assertTaxonomySmoke({
	fixture: 'e2e-preset-taxonomy-radial-gradient.php',
	muName: 'e2e-preset-taxonomy-radial-gradient.php',
	openScreen: () => openGlobalStylesRadialGradientsScreen(),
	presetsSelector: '.blockera-radial-gradients-presets',
	headerSelector: '[data-cy="gradient-repeater-item-header"]',
});

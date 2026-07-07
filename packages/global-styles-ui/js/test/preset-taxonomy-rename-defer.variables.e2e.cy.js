/**
 * E2E: deferred taxonomy rename (no regroup while popover open) and flat → grouped promotion.
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
} from '@blockera/dev-cypress/js/helpers';
import {
	assertPresetTaxonomyGroupShell,
	assertPresetTaxonomyTreeVisible,
	closeVisibleGlobalStylesPresetPopover,
	openGlobalStylesBorderRadiusScreen,
	openGlobalStylesPresetRepeaterHeader,
	openGlobalStylesShadowsScreen,
	openGlobalStylesSpacingScreen,
	typeGlobalStylesPresetNameInVisiblePopover,
} from '@blockera/dev-cypress/js/helpers/global-styles';

const FIX = 'packages/global-styles-ui/js/test/fixtures';

describe('Global Styles UI → preset taxonomy rename defer', () => {
	const MU = `${FIX}/e2e-preset-taxonomy-spacing.php`;
	const MU_NAME = 'e2e-preset-taxonomy-spacing-rename-defer.php';

	beforeEach(() => {
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('keeps existing group until popover closes after renaming within taxonomy', () => {
		openGlobalStylesSpacingScreen();

		cy.get('.blockera-spacing-presets', { timeout: 20000 }).should(
			'be.visible'
		);
		assertPresetTaxonomyTreeVisible({ visible: true });
		assertPresetTaxonomyGroupShell('E2E Group', { exists: true });

		openGlobalStylesPresetRepeaterHeader(
			'[data-cy="spacing-size-repeater-item-header"]',
			'Tiny'
		);

		typeGlobalStylesPresetNameInVisiblePopover('E2E Other / Tiny');

		assertPresetTaxonomyGroupShell('E2E Group', { exists: true });
		assertPresetTaxonomyGroupShell('E2E Other', { exists: false });

		closeVisibleGlobalStylesPresetPopover();

		assertPresetTaxonomyGroupShell('E2E Other', { exists: true });
		cy.contains(
			'[data-cy="spacing-size-repeater-item-header"]',
			'Tiny'
		).should('be.visible');
	});
});

describe('Global Styles UI → flat preset promotes to grouped taxonomy after rename', () => {
	const BORDER_RADIUS_MU = `${FIX}/e2e-preset-taxonomy-flat-border-radius.php`;
	const BORDER_RADIUS_MU_NAME = 'e2e-preset-taxonomy-flat-border-radius.php';
	const SHADOW_MU = `${FIX}/e2e-preset-taxonomy-flat-shadow.php`;
	const SHADOW_MU_NAME = 'e2e-preset-taxonomy-flat-shadow.php';

	describe('border radius (theme)', () => {
		beforeEach(() => {
			activateMuPlugin({
				pluginPath: BORDER_RADIUS_MU,
				pluginName: BORDER_RADIUS_MU_NAME,
			});
		});

		afterEach(() => {
			deactivateMuPlugin({
				pluginPath: BORDER_RADIUS_MU,
				pluginName: BORDER_RADIUS_MU_NAME,
			});
		});

		it('shows grouped layout only after closing popover when a group is added to a flat name', () => {
			openGlobalStylesBorderRadiusScreen();

			cy.get('.blockera-border-radius-presets', {
				timeout: 20000,
			}).should('be.visible');
			assertPresetTaxonomyTreeVisible({ visible: false });

			openGlobalStylesPresetRepeaterHeader(
				'[data-cy="border-radius-preset-repeater-item-header"]',
				'E2E Flat Radius'
			);

			typeGlobalStylesPresetNameInVisiblePopover('E2E Promoted / Small');

			assertPresetTaxonomyTreeVisible({ visible: false });
			assertPresetTaxonomyGroupShell('E2E Promoted', { exists: false });

			closeVisibleGlobalStylesPresetPopover();

			assertPresetTaxonomyTreeVisible({ visible: true });
			assertPresetTaxonomyGroupShell('E2E Promoted', { exists: true });
			cy.contains(
				'[data-cy="border-radius-preset-repeater-item-header"]',
				'Small',
				{ timeout: 20000 }
			).should('be.visible');
		});
	});

	describe('box shadow (theme)', () => {
		beforeEach(() => {
			activateMuPlugin({
				pluginPath: SHADOW_MU,
				pluginName: SHADOW_MU_NAME,
			});
		});

		afterEach(() => {
			deactivateMuPlugin({
				pluginPath: SHADOW_MU,
				pluginName: SHADOW_MU_NAME,
			});
		});

		it('shows grouped layout only after closing popover when a group is added to a flat name', () => {
			openGlobalStylesShadowsScreen();

			cy.get('.blockera-shadows-editor', { timeout: 20000 }).should(
				'be.visible'
			);
			assertPresetTaxonomyTreeVisible({ visible: false });

			openGlobalStylesPresetRepeaterHeader(
				'[data-cy="shadow-preset-repeater-item-header"]',
				'E2E Flat Shadow'
			);

			typeGlobalStylesPresetNameInVisiblePopover('E2E Promoted / Soft');

			assertPresetTaxonomyTreeVisible({ visible: false });
			assertPresetTaxonomyGroupShell('E2E Promoted', { exists: false });

			closeVisibleGlobalStylesPresetPopover();

			assertPresetTaxonomyTreeVisible({ visible: true });
			assertPresetTaxonomyGroupShell('E2E Promoted', { exists: true });
			cy.contains(
				'[data-cy="shadow-preset-repeater-item-header"]',
				'Soft',
				{ timeout: 20000 }
			).should('be.visible');
		});
	});
});

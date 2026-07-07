/**
 * User capability: without `canUser( 'update', globalStyles )`, Blockera must not offer
 * variable add/edit controls, but the block variable picker must still apply existing presets.
 *
 * Site Editor Design System is out of scope: WP 7+ hides the Styles sidebar when update
 * is false on load, so restricted-user coverage lives in the post editor variable picker.
 *
 * Read-only caps are enforced server-side via {@link ../fixtures/e2e-global-styles-read-only.php}.
 */
import {
	activateGlobalStylesReadOnlyE2eFixture,
	activateMuPlugin,
	createPost,
	deactivateGlobalStylesReadOnlyE2eFixture,
	deactivateMuPlugin,
	expectBlockAttrIncludesPresetVar,
	expectGlobalStylesEntityUpdateForbidden,
	openRepeaterHeaderVariablePicker,
} from '@blockera/dev-cypress/js/helpers';
import { withinVariablePickerPopover } from '@blockera/dev-cypress/js/helpers/variable-picker';

const THEME_TRANSFORM_MU =
	'packages/global-styles-ui/js/test/fixtures/preset-theme-transform.php';
const THEME_TRANSFORM_MU_NAME = 'blockera-test-gsui-preset-transform.php';

const CUSTOM_TRANSFORM_MU =
	'packages/global-styles-ui/js/test/fixtures/preset-custom-transform.php';
const CUSTOM_TRANSFORM_MU_NAME =
	'blockera-test-gsui-preset-custom-transform.php';

/** Theme.json preset from {@link THEME_TRANSFORM_MU}. */
const THEME_TRANSFORM_SLUG = 'e-2-e-theme-transform';
const THEME_TRANSFORM_LABEL = 'E2E Theme Transform';

/** User custom preset from {@link CUSTOM_TRANSFORM_MU}. */
const CUSTOM_TRANSFORM_SLUG = 'e-2-e-custom-transform';
const CUSTOM_TRANSFORM_LABEL = 'E2E Custom Transform';

function openTransformVariablePicker() {
	createPost();

	cy.getBlock('default').type(
		'Global styles read-only; transform variable picker.',
		{ delay: 0 }
	);
	cy.getByAriaControls('styles-view').click();

	openRepeaterHeaderVariablePicker('Transforms');
}

function assertTransformPickerReadOnlyControlsHidden() {
	cy.getByDataTest('variable-picker-header-add-custom-variable').should(
		'not.exist'
	);

	cy.get(
		'[data-test="global-styles-preset-add-transform-preset-presets-custom"]'
	).should('not.exist');

	cy.get('[class*="btn-edit-item"]').should('not.exist');
}

function assertPresetEditPopoverBlockedAfterHeaderClick(label) {
	withinVariablePickerPopover(() => {
		cy.contains('[data-cy="transform-preset-repeater-item-header"]', label)
			.scrollIntoView()
			.click({ force: true });
	});

	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(400);

	cy.get('body').then(($body) => {
		expect(
			$body.find('[aria-label="Move-X"]').length,
			'Move-X control should not mount when edit is forbidden'
		).to.eq(0);
	});

	cy.get('[class*="btn-edit-item"]').should('not.exist');
}

describe('Global styles permission (no update on entity → variable picker)', () => {
	beforeEach(() => {
		activateGlobalStylesReadOnlyE2eFixture();
	});

	afterEach(() => {
		deactivateGlobalStylesReadOnlyE2eFixture();
	});

	describe('Theme variables', () => {
		beforeEach(() => {
			activateMuPlugin({
				pluginPath: THEME_TRANSFORM_MU,
				pluginName: THEME_TRANSFORM_MU_NAME,
			});
		});

		afterEach(() => {
			deactivateMuPlugin({
				pluginPath: THEME_TRANSFORM_MU,
				pluginName: THEME_TRANSFORM_MU_NAME,
			});
		});

		it('hides add and edit controls but still applies an existing theme transform preset', () => {
			openTransformVariablePicker();

			expectGlobalStylesEntityUpdateForbidden();

			withinVariablePickerPopover(() => {
				cy.contains(THEME_TRANSFORM_LABEL).should('be.visible');
				assertTransformPickerReadOnlyControlsHidden();
			});

			cy.selectValueAddonItem(THEME_TRANSFORM_SLUG);

			const varNeedle = `--wp--preset--transform--${THEME_TRANSFORM_SLUG}`;

			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should('include', varNeedle);
			});

			expectBlockAttrIncludesPresetVar('blockeraTransform', varNeedle);
		});

		it('does not open a preset edit popover when clicking a theme transform row', () => {
			openTransformVariablePicker();

			expectGlobalStylesEntityUpdateForbidden();

			assertPresetEditPopoverBlockedAfterHeaderClick(
				THEME_TRANSFORM_LABEL
			);
		});
	});

	describe('Custom variables', () => {
		beforeEach(() => {
			activateMuPlugin({
				pluginPath: CUSTOM_TRANSFORM_MU,
				pluginName: CUSTOM_TRANSFORM_MU_NAME,
			});
		});

		afterEach(() => {
			deactivateMuPlugin({
				pluginPath: CUSTOM_TRANSFORM_MU,
				pluginName: CUSTOM_TRANSFORM_MU_NAME,
			});
		});

		it('hides add and edit controls but still applies an existing custom transform preset', () => {
			openTransformVariablePicker();

			expectGlobalStylesEntityUpdateForbidden();

			withinVariablePickerPopover(() => {
				cy.contains(CUSTOM_TRANSFORM_LABEL).should('be.visible');
				assertTransformPickerReadOnlyControlsHidden();
			});

			cy.selectValueAddonItem(CUSTOM_TRANSFORM_SLUG);

			const varNeedle = `--wp--preset--transform--${CUSTOM_TRANSFORM_SLUG}`;

			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should('include', varNeedle);
			});

			expectBlockAttrIncludesPresetVar('blockeraTransform', varNeedle);
		});

		it('does not open a preset edit popover when clicking a custom transform row', () => {
			openTransformVariablePicker();

			expectGlobalStylesEntityUpdateForbidden();

			assertPresetEditPopoverBlockedAfterHeaderClick(
				CUSTOM_TRANSFORM_LABEL
			);
		});
	});
});

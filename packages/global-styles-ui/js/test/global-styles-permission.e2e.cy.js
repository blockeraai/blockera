/**
 * User capability: global styles presets are read-only without `update` on the global styles entity,
 * while variable-picker “pick preset” for blocks still works (does not mutate theme.json).
 *
 * Covers flows used from:
 * - Site Editor → Blockera Design System (editor global-styles navigation)
 * - Post editor → value addon / variable picker (controls value-addons)
 *
 * Read-only mode is enforced server-side via MU plugin {@link ../fixtures/e2e-global-styles-read-only.php}.
 */
import {
	activateGlobalStylesReadOnlyE2eFixture,
	activateMuPlugin,
	createPost,
	deactivateGlobalStylesReadOnlyE2eFixture,
	deactivateMuPlugin,
	expectBlockAttrIncludesPresetVar,
	openGlobalStylesTransformsScreen,
	openRepeaterHeaderVariablePicker,
} from '@blockera/dev-cypress/js/helpers';

const THEME_TRANSFORM_MU =
	'packages/global-styles-ui/js/test/fixtures/preset-theme-transform.php';
const THEME_TRANSFORM_MU_NAME = 'blockera-test-gsui-preset-transform.php';

/** Theme.json preset from {@link THEME_TRANSFORM_MU}; matches `preset-theme-transform.php`. */
const THEME_TRANSFORM_SLUG = 'e-2-e-theme-transform';

describe('Global styles permission (read-only entity vs variable picker)', () => {
	describe('Site Editor → Design System transforms (global-styles-ui)', () => {
		beforeEach(() => {
			activateMuPlugin(THEME_TRANSFORM_MU, THEME_TRANSFORM_MU_NAME);
			activateGlobalStylesReadOnlyE2eFixture();
		});

		afterEach(() => {
			deactivateGlobalStylesReadOnlyE2eFixture();
			deactivateMuPlugin(THEME_TRANSFORM_MU, THEME_TRANSFORM_MU_NAME);
		});

		it('does not open the preset edit popover when clicking a theme transform row (read-only)', () => {
			openGlobalStylesTransformsScreen();

			cy.get('.blockera-transforms-presets', { timeout: 20000 }).should(
				'contain',
				'E2E Theme Transform'
			);

			cy.contains(
				'.blockera-transforms-presets [data-cy="transform-preset-repeater-item-header"]',
				'E2E Theme Transform'
			).click({ force: true });

			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(400);

			cy.get('body').then(($body) => {
				expect(
					$body.find('[aria-label="Move-X"]').length,
					'Move-X control should not mount when popover is blocked'
				).to.eq(0);
			});
		});

		it('does not offer “Add New” for custom transform presets when read-only', () => {
			openGlobalStylesTransformsScreen();

			cy.get('.blockera-transforms-presets', { timeout: 20000 }).should(
				'be.visible'
			);

			cy.get(
				'[data-cy="global-styles-preset-add-transform-preset-presets-custom"]'
			).should('not.exist');
		});
	});

	describe('Post editor → variable picker (value-addons)', () => {
		beforeEach(() => {
			activateMuPlugin(THEME_TRANSFORM_MU, THEME_TRANSFORM_MU_NAME);
			activateGlobalStylesReadOnlyE2eFixture();
		});

		afterEach(() => {
			deactivateGlobalStylesReadOnlyE2eFixture();
			deactivateMuPlugin(THEME_TRANSFORM_MU, THEME_TRANSFORM_MU_NAME);
		});

		it('still applies a theme transform preset to the block when global styles are read-only', () => {
			createPost();

			cy.getBlock('default').type(
				'Read-only global styles; pick theme transform preset.',
				{ delay: 0 }
			);
			cy.getByDataTest('style-tab').click();

			openRepeaterHeaderVariablePicker('Transforms');

			cy.selectValueAddonItem(THEME_TRANSFORM_SLUG);

			const varNeedle = `--wp--preset--transform--${THEME_TRANSFORM_SLUG}`;

			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should('include', varNeedle);
			});

			expectBlockAttrIncludesPresetVar('blockeraTransform', varNeedle);
		});
	});
});

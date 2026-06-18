/**
 * Site editor helpers for Blockera global styles → design-system preset screens (colors, spacing, shadows, …).
 *
 * Entity access mirrors `packages/global-styles-ui/js/context/global-styles-provider.ts`:
 * `store` from `@wordpress/core-data` (`wp.coreData.store`), `__experimentalGetCurrentGlobalStylesId`,
 * `canUser( 'update', { kind: 'root', name: 'globalStyles', id } )`, and `editEntityRecord` for the same entity.
 */
import {
	activateMuPlugin,
	closeWelcomeGuide,
	deactivateMuPlugin,
	getSelectedBlock,
	getWPDataObject,
} from './editor';
import { openSiteEditor } from './site-navigation';

const COLORS_OVERRIDE_CLASS = 'is-open-blockera-colors-navigation-override';
const SHADOWS_OVERRIDE_CLASS = 'is-open-blockera-shadows-navigation-override';

/** WP 6.x + 7.x global styles navigator screen (class renamed in WP 7). */
const NAVIGATOR_SCREEN_SELECTOR =
	'.edit-site-global-styles-sidebar__navigator-screen, .global-styles-ui-sidebar__navigator-screen';

/** Body class while Blockera typography global-styles override is active (exported for Cypress assertions). */
export const TYPOGRAPHY_OVERRIDE_CLASS =
	'is-open-blockera-typography-navigation-override';

/** Matches `global-styles-provider` entity tuple. */
const GLOBAL_STYLES_KIND = 'root';
const GLOBAL_STYLES_NAME = 'globalStyles';

/**
 * @param {Window} win
 * @return {{ select: Function, dispatch: Function }} core-data `select` / `dispatch` (same as `useSelect(coreStore)` / `useDispatch(coreStore)`).
 */
function getCoreDataStoreApis(win) {
	const registry = win.wp?.data;
	const store = win.wp?.coreData?.store;

	if (!registry) {
		throw new Error('wp.data is not available');
	}

	if (!store) {
		throw new Error(
			'wp.coreData.store is not available; load the block editor with @wordpress/core-data.'
		);
	}

	return {
		select: registry.select(store),
		dispatch: registry.dispatch(store),
	};
}

/**
 * @param {{ select: Function }} apis
 * @return {string|number|undefined} Same id as `useGlobalStylesUserConfig` → `_globalStylesId`.
 */
function getGlobalStylesIdFromStore(apis) {
	const { select } = apis;

	if (typeof select.__experimentalGetCurrentGlobalStylesId === 'function') {
		return select.__experimentalGetCurrentGlobalStylesId();
	}

	if (typeof select.getCurrentGlobalStylesId === 'function') {
		return select.getCurrentGlobalStylesId();
	}

	return undefined;
}

/**
 * Discards in-memory edits for the global styles entity when `getEditedEntityRecord` differs from
 * the base `getEntityRecord` (same tuple as `global-styles-provider`). Resets by `editEntityRecord`
 * with `styles`, `settings`, and `_links` taken from the base record (same fields Blockera mutates).
 *
 * Skips when `canUser( 'update', { kind, name, id } )` is false (read-only path in provider).
 *
 * @return {Cypress.Chainable} Cypress chain after discard logic runs in the app window.
 */
export function resetGlobalStylesEntityRecord() {
	return cy.window().then((win) => {
		const { select, dispatch } = getCoreDataStoreApis(win);
		const recordId = getGlobalStylesIdFromStore({ select });

		if (recordId === undefined || recordId === null || recordId === '') {
			throw new Error(
				'No global styles entity id: open the Site Editor and wait until global styles resolve.'
			);
		}

		if (typeof select.canUser === 'function') {
			const userCanEditGlobalStyles = select.canUser('update', {
				kind: GLOBAL_STYLES_KIND,
				name: GLOBAL_STYLES_NAME,
				id: recordId,
			});

			if (userCanEditGlobalStyles === false) {
				return;
			}

			if (typeof userCanEditGlobalStyles !== 'boolean') {
				throw new Error(
					'Global styles `canUser` not resolved yet; retry after the Site Editor finishes loading.'
				);
			}
		}

		const kind = GLOBAL_STYLES_KIND;
		const name = GLOBAL_STYLES_NAME;

		if (typeof dispatch.editEntityRecord !== 'function') {
			throw new Error(
				'core-data editEntityRecord is not available; cannot discard global styles edits.'
			);
		}

		dispatch.editEntityRecord(kind, name, recordId, {
			styles: {},
			settings: {},
		});
	});
}

/**
 * Reads `settings` from the theme base global styles config (merged theme.json layer).
 * Dot path example: `spacing.spacingSizes.theme`.
 *
 * @param {string} dotPath
 * @return {Cypress.Chainable<unknown>}
 */
export function getThemeBaseGlobalStylesSetting(dotPath) {
	return cy.window().then((win) => {
		const select = win.wp.data.select('core');
		const base = select.__experimentalGetCurrentThemeBaseGlobalStyles?.();
		let cur = base?.settings;
		for (const key of dotPath.split('.')) {
			if (cur == null) {
				return undefined;
			}
			cur = cur[key];
		}
		return cur;
	});
}

/**
 * Reads `settings` from the edited global styles entity (user / Site Editor layer).
 *
 * @param {string} dotPath
 * @return {Cypress.Chainable<unknown>}
 */
export function getEditedGlobalStylesSetting(dotPath) {
	return cy.window().then((win) => {
		const select = win.wp.data.select('core');
		const id =
			typeof select.__experimentalGetCurrentGlobalStylesId === 'function'
				? select.__experimentalGetCurrentGlobalStylesId()
				: select.getCurrentGlobalStylesId?.();
		const record = select.getEditedEntityRecord(
			GLOBAL_STYLES_KIND,
			GLOBAL_STYLES_NAME,
			id
		);
		let cur = record?.settings;
		for (const key of dotPath.split('.')) {
			if (cur == null) {
				return undefined;
			}
			cur = cur[key];
		}
		return cur;
	});
}

/**
 * Opens Site Editor, Blockera global styles Colors list, and the Color variables screen.
 */
export function openGlobalStylesColorPaletteScreen(
	{ reset } = { reset: true }
) {
	openSiteEditor();

	if (reset) {
		resetGlobalStylesEntityRecord();
	}

	cy.openGlobalStylesPanel();

	closeWelcomeGuide();

	cy.get('button[id="/colors"]').eq(1).should('exist').click({ force: true });

	cy.get('body').should('have.class', COLORS_OVERRIDE_CLASS);

	cy.get(NAVIGATOR_SCREEN_SELECTOR, {
		timeout: 20000,
	}).should('exist');

	cy.get('.blockera-colors-hub').should('exist');

	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(1000);

	cy.getByDataTest('global-styles-nav-colors-palette').click({ force: true });

	cy.getByDataTest('global-styles-color-palette-screen', {
		timeout: 20000,
	}).should('be.visible');
}

/**
 * Shared Site Editor + Global Styles open; does not navigate into a design-system panel.
 *
 * @param {{ reset?: boolean }} options
 * @return {Cypress.Chainable} The global styles sidebar screen.
 */
function openSiteEditorGlobalStylesBase({ reset } = { reset: true }) {
	openSiteEditor();

	if (reset) {
		resetGlobalStylesEntityRecord();
	}

	cy.openGlobalStylesPanel();

	closeWelcomeGuide();

	return cy
		.get(NAVIGATOR_SCREEN_SELECTOR, {
			timeout: 20000,
		})
		.should('exist');
}

/**
 * Clicks a Blockera Design System nav button (`#spacing-panel`, `#borders-panel`, …) and waits for the preset shell.
 *
 * @param {{ panelButtonId: string, waitSelector: string, reset?: boolean }} options
 * @return {Cypress.Chainable} The global styles sidebar screen.
 */
export function openGlobalStylesDesignSystemPresetScreen({
	panelButtonId,
	waitSelector,
	reset = true,
}) {
	openSiteEditorGlobalStylesBase({ reset });

	cy.get(`button[id="/${panelButtonId}"]`, { timeout: 20000 })
		.should('exist')
		.click({ force: true });

	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(500);

	return cy.get(waitSelector, { timeout: 20000 }).should('be.visible');
}

/** Spacing variables (`settings.spacing.spacingSizes.custom`). */
export function openGlobalStylesSpacingScreen({ reset } = { reset: true }) {
	return openGlobalStylesDesignSystemPresetScreen({
		panelButtonId: 'spacing',
		waitSelector: '.blockera-spacing-presets',
		reset,
	});
}

/** Box shadow presets (`settings.shadow.presets.custom`). Clicks WP `/shadows` via Blockera handler. */
export function openGlobalStylesShadowsScreen({ reset } = { reset: true }) {
	openSiteEditorGlobalStylesBase({ reset });

	cy.get('button[id="/shadows"]')
		.eq(1)
		.should('exist')
		.click({ force: true });

	cy.get('body').should('have.class', SHADOWS_OVERRIDE_CLASS);

	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(500);

	return cy
		.get('.blockera-shadows-editor', { timeout: 20000 })
		.should('be.visible');
}

/** Border box presets (`settings.border.presets.custom`). */
export function openGlobalStylesBordersScreen({ reset } = { reset: true }) {
	return openGlobalStylesDesignSystemPresetScreen({
		panelButtonId: 'borders',
		waitSelector: '.blockera-borders-presets',
		reset,
	});
}

/** Border radius presets (`settings.border.radiusSizes.custom`). */
export function openGlobalStylesBorderRadiusScreen(
	{ reset } = { reset: true }
) {
	return openGlobalStylesDesignSystemPresetScreen({
		panelButtonId: 'border-radius',
		waitSelector: '.blockera-border-radius-presets',
		reset,
	});
}

/** Text shadow presets (`settings.textShadow.presets.custom`). */
export function openGlobalStylesTextShadowsScreen({ reset } = { reset: true }) {
	return openGlobalStylesDesignSystemPresetScreen({
		panelButtonId: 'text-shadows',
		waitSelector: '.blockera-text-shadows-presets',
		reset,
	});
}

/** Transform presets (`settings.transform.presets.custom`). */
export function openGlobalStylesTransformsScreen({ reset } = { reset: true }) {
	return openGlobalStylesDesignSystemPresetScreen({
		panelButtonId: 'transforms',
		waitSelector: '.blockera-transforms-presets',
		reset,
	});
}

/** Transition presets (`settings.transition.presets.custom`). */
export function openGlobalStylesTransitionsScreen({ reset } = { reset: true }) {
	return openGlobalStylesDesignSystemPresetScreen({
		panelButtonId: 'transitions',
		waitSelector: '.blockera-transitions-presets',
		reset,
	});
}

/** Filter presets (`settings.filter.presets.custom`). */
export function openGlobalStylesFiltersScreen({ reset } = { reset: true }) {
	return openGlobalStylesDesignSystemPresetScreen({
		panelButtonId: 'filters',
		waitSelector: '.blockera-filters-presets',
		reset,
	});
}

/**
 * Global Styles → Typography list (font size presets entry + Blockera typography override).
 *
 * @param {{ reset?: boolean }} options Pass `reset: true` to discard in-memory global styles edits before navigation (default false matches legacy typography panel specs).
 */
export function openGlobalStylesTypographyFlow({ reset } = { reset: false }) {
	openSiteEditorGlobalStylesBase({ reset });

	cy.get('button[id="/typography"]', { timeout: 20000 })
		.eq(1)
		.should('be.visible')
		.click({ force: true });

	cy.get('body').should('have.class', TYPOGRAPHY_OVERRIDE_CLASS);

	cy.get(NAVIGATOR_SCREEN_SELECTOR, {
		timeout: 20000,
	}).should('exist');

	cy.get('.blockera-font-size-hub', { timeout: 20000 }).should('exist');
}

/**
 * Typography → Font size variables (design-system font size presets).
 *
 * @param {{ reset?: boolean }} options
 */
export function openGlobalStylesFontSizesVariablesScreen(
	{ reset } = { reset: true }
) {
	openGlobalStylesTypographyFlow({ reset });

	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(500);

	cy.contains('.blockera-font-size-hub button', 'Font size variables')
		.scrollIntoView()
		.should('exist')
		.click({ force: true });

	return cy
		.get('.blockera-font-size-editor', { timeout: 20000 })
		.should('be.visible');
}

/**
 * Colors → Linear gradient variables screen.
 *
 * @param {{ reset?: boolean }} options
 */
export function openGlobalStylesLinearGradientsScreen(
	{ reset } = { reset: true }
) {
	openSiteEditorGlobalStylesBase({ reset });

	cy.get('button[id="/colors"]').eq(1).should('exist').click({ force: true });

	cy.get('body').should('have.class', COLORS_OVERRIDE_CLASS);

	cy.get(NAVIGATOR_SCREEN_SELECTOR, {
		timeout: 20000,
	}).should('exist');

	cy.get('.blockera-colors-hub').should('exist');

	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(500);

	cy.contains('.blockera-colors-hub button', 'Linear gradient variables')
		.should('be.visible')
		.click({ force: true });

	return cy
		.get('.blockera-linear-gradients-presets', { timeout: 20000 })
		.should('be.visible');
}

/**
 * Colors → Radial gradient variables screen.
 *
 * @param {{ reset?: boolean }} options
 */
export function openGlobalStylesRadialGradientsScreen(
	{ reset } = { reset: true }
) {
	openSiteEditorGlobalStylesBase({ reset });

	cy.get('button[id="/colors"]').eq(1).should('exist').click({ force: true });

	cy.get('body').should('have.class', COLORS_OVERRIDE_CLASS);

	cy.get(NAVIGATOR_SCREEN_SELECTOR, {
		timeout: 20000,
	}).should('exist');

	cy.get('.blockera-colors-hub').should('exist');

	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(500);

	cy.contains('.blockera-colors-hub button', 'Radial gradient variables')
		.should('be.visible')
		.click({ force: true });

	return cy
		.get('.blockera-radial-gradients-presets', { timeout: 20000 })
		.should('be.visible');
}

/**
 * Adds a custom preset row, sets the display name (slug follows SharedPresetControls), closes the popover.
 *
 * @param {{ addDataTest: string, presetName: string }} options - Options for adding and naming the custom preset.
 */
export function nameNewGlobalStylesCustomPreset({ addDataTest, presetName }) {
	cy.addNewGlobalStylesCustomPresetByDataTest(addDataTest);

	cy.getParentContainer('Custom Variables').within(() => {
		cy.get('[data-cy="repeater-item"]', { timeout: 15000 })
			.last()
			.should('be.visible');
	});

	// eslint-disable-next-line cypress/unsafe-to-chain-command
	cy.getByDataTest('global-styles-preset-name-field')
		.first()
		.should('be.visible')
		.clear({ force: true })
		.type(presetName, { delay: 0, force: true });

	cy.realPress('Escape');
}

/**
 * Sets the preset description textarea in the visible variable edit popover.
 *
 * @param {string} text Description text to type.
 */
export function setGlobalStylesPresetDescription(text) {
	cy.getByDataTest('global-styles-preset-description-field')
		.click({ force: true })
		.type('{selectall}' + text, { delay: 0, force: true });
}

/**
 * Border custom preset: open the last row and set “all” width so `--wp--preset--border--*` has a non-empty fallback.
 *
 */
export function setGlobalStylesCustomBorderPresetMinWidth(widthPx = '2') {
	cy.getByDataCy('border-preset-repeater-item-header')
		.last()
		.click({ force: true });

	cy.get('.components-popover', { timeout: 15000 }).should('be.visible');

	cy.get('.components-popover')
		.filter(':visible')
		.last()
		.within(() => {
			cy.getByDataTest('border-control-width').clear({ force: true });
			cy.getByDataTest('border-control-width').type(widthPx, {
				delay: 0,
				force: true,
			});
		});

	cy.realPress('Escape');
}

/**
 * Opens the variable picker from a repeater header (shadow, text-shadow, transform, transition, filter).
 *
 * @param {string|string[]} getParentLabel — `getParentContainer` label(s).
 * @param {string} [parentsDataCy='base-control'] — Closest parent `data-cy` (e.g. `'blockera-repeater-control'` for Transforms).
 * @return {Cypress.Chainable} Chainable Cypress query for the variable picker popover.
 */
export function openRepeaterHeaderVariablePicker(
	getParentLabel,
	parentsDataCy = 'base-control'
) {
	cy.getParentContainer(getParentLabel, parentsDataCy).within(() => {
		cy.getByDataCy('blockera-repeater-control')
			.first()
			.within(() => {
				cy.getByDataCy('value-addon-btn-open').click({ force: true });
			});
	});

	return cy
		.getByDataTest('variable-picker-popover', { timeout: 15000 })
		.should('be.visible');
}

/**
 * Asserts serialized selected-block data references a global preset CSS variable (nested shapes).
 *
 * @param {string} attributeKey Blockera attribute name (e.g. `blockeraSpacing`).
 * @param {string} varNeedle Substring such as `--wp--preset--spacing--e2e-spacing`.
 */
export function expectBlockAttrIncludesPresetVar(attributeKey, varNeedle) {
	getWPDataObject().then((data) => {
		const raw = JSON.stringify(getSelectedBlock(data, attributeKey));
		expect(raw, attributeKey).to.include(varNeedle);
	});
}

/** Relative to plugin root; copied to mu-plugins by {@link activateMuPlugin}. */
export const E2E_GLOBAL_STYLES_READ_ONLY_MU =
	'packages/global-styles-ui/js/test/fixtures/e2e-global-styles-read-only.php';

export const E2E_GLOBAL_STYLES_READ_ONLY_MU_NAME =
	'blockera-test-e2e-global-styles-read-only.php';

/**
 * Activates the read-only global styles MU plugin (no edit/delete `wp_global_styles`; REST writes 403).
 */
export function activateGlobalStylesReadOnlyE2eFixture() {
	return activateMuPlugin(
		E2E_GLOBAL_STYLES_READ_ONLY_MU,
		E2E_GLOBAL_STYLES_READ_ONLY_MU_NAME
	);
}

export function deactivateGlobalStylesReadOnlyE2eFixture() {
	return deactivateMuPlugin(
		E2E_GLOBAL_STYLES_READ_ONLY_MU,
		E2E_GLOBAL_STYLES_READ_ONLY_MU_NAME
	);
}

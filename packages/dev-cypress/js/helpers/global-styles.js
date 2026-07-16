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
	saveSiteEditorDirtyEntities,
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
 * Reopens Site Editor, clears the globalStyles entity, and persists the empty record.
 * Use in afterEach when a spec seeds/saves custom presets (e.g. hover canvas preview).
 *
 * @return {Cypress.Chainable}
 */
export function resetAndSaveGlobalStylesEntityRecord() {
	openSiteEditor();
	resetGlobalStylesEntityRecord();
	return saveSiteEditorDirtyEntities();
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
 * Retries until theme base global styles include core default gradients and a slug.
 * Use before opening the variable picker when tests depend on MU `defaultGradients`.
 *
 * @param {string} slug Gradient preset slug (e.g. `vivid-cyan-blue-to-vivid-purple`).
 * @return {Cypress.Chainable}
 */
export function waitForThemeBaseDefaultGradientPreset(slug) {
	return cy.window({ timeout: 30000 }).should((win) => {
		const select = win.wp?.data?.select?.('core');
		expect(
			select?.__experimentalGetCurrentThemeBaseGlobalStyles,
			'__experimentalGetCurrentThemeBaseGlobalStyles'
		).to.be.a('function');

		const base = select.__experimentalGetCurrentThemeBaseGlobalStyles();
		expect(base, 'theme base global styles').to.exist;

		const settings = base.settings ?? base;
		expect(
			settings?.color?.defaultGradients,
			'color.defaultGradients'
		).to.equal(true);

		const defaults = settings?.color?.gradients?.default;
		expect(
			Array.isArray(defaults) && defaults.length > 0,
			'color.gradients.default'
		).to.equal(true);

		const row = defaults.find((g) => String(g?.slug ?? '') === slug);
		expect(row, `default gradient preset "${slug}"`).to.exist;
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

/** Border box presets (`settings.border.blockeraBorder.presets.custom`). */
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

	cy.get('.blockera-typography-hub', { timeout: 20000 }).should('exist');
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

	cy.contains('.blockera-typography-hub button', 'Font size variables')
		.scrollIntoView()
		.should('exist')
		.click({ force: true });

	return cy
		.get('.blockera-font-size-editor', { timeout: 20000 })
		.should('be.visible');
}

/**
 * Typography → Line height variables (design-system line height presets).
 *
 * @param {{ reset?: boolean }} options
 */
export function openGlobalStylesLineHeightsVariablesScreen(
	{ reset } = { reset: true }
) {
	openGlobalStylesTypographyFlow({ reset });

	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(500);

	cy.contains('.blockera-typography-hub button', 'Line height variables')
		.scrollIntoView()
		.should('exist')
		.click({ force: true });

	return cy
		.get('.blockera-line-height-editor', { timeout: 20000 })
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
 * @param {{ addDataTest: string, presetName: string, closePopover?: boolean }} options - Options for adding and naming the custom preset.
 */
export function nameNewGlobalStylesCustomPreset({
	addDataTest,
	presetName,
	closePopover = true,
}) {
	cy.addNewGlobalStylesCustomPresetByDataTest(addDataTest);

	cy.getParentContainer('Custom variables').within(() => {
		cy.get('[data-cy="repeater-item"]', { timeout: 20000 })
			.last()
			.should('be.visible');
	});

	cy.getByDataTest('repeater-item-creating-step', { timeout: 20000 }).should(
		'exist'
	);

	cy.getByDataTest('global-styles-preset-name-field', { timeout: 20000 })
		.first()
		.should('be.visible')
		.click({ force: true });

	cy.getByDataTest('global-styles-preset-name-field', { timeout: 20000 })
		.first()
		.clear({ force: true });

	cy.getByDataTest('global-styles-preset-name-field', { timeout: 20000 })
		.first()
		.type('{selectall}' + presetName, { delay: 0, force: true });

	cy.getByDataTest('global-styles-preset-name-field', { timeout: 20000 })
		.first()
		.should('have.value', presetName);

	if (closePopover) {
		cy.realPress('Escape');
	}
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
 * Border custom preset: set “all” width so `--wp--preset--border--*` has a non-empty fallback.
 * When the create/edit popover is already open (e.g. right after naming), skips the header click.
 *
 * @param {string} widthPx Width in pixels (no unit).
 * @param {{ presetName?: string }} [options] When set, targets that row under `.blockera-borders-presets`.
 */
export function setGlobalStylesCustomBorderPresetMinWidth(
	widthPx = '2',
	{ presetName } = {}
) {
	cy.get('body').then(($body) => {
		if ($body.find('[data-test="border-control-width"]:visible').length) {
			return;
		}

		const headerSelector =
			'.blockera-borders-presets [data-cy="border-preset-repeater-item-header"]';

		if (presetName) {
			cy.contains(headerSelector, presetName).click({ force: true });
		} else {
			cy.get(headerSelector).last().click({ force: true });
		}
	});

	cy.get('.components-popover', { timeout: 15000 })
		.filter(':visible')
		.last()
		.should('be.visible')
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

/**
 * Last visible Gutenberg popover used for global-styles preset edit fields.
 *
 * @return {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getVisibleGlobalStylesPresetPopover() {
	return cy
		.get('.components-popover')
		.filter(':visible')
		.last()
		.should('be.visible');
}

/**
 * Opens a preset row by repeater header label and waits for the edit popover.
 *
 * @param {string} headerSelector `[data-cy]` selector for the repeater header.
 * @param {string} label Visible header label text.
 */
export function openGlobalStylesPresetRepeaterHeader(headerSelector, label) {
	cy.contains(headerSelector, label, { timeout: 20000 }).click({
		force: true,
	});
	getVisibleGlobalStylesPresetPopover();
}

/**
 * Types into the Name field inside the visible preset edit popover.
 *
 * @param {string} presetName Full name value to type.
 * @param {{ clear?: boolean }} [options]
 */
export function typeGlobalStylesPresetNameInVisiblePopover(
	presetName,
	{ clear = true } = {}
) {
	getVisibleGlobalStylesPresetPopover().within(() => {
		const field = cy
			.getByDataTest('global-styles-preset-name-field')
			.first()
			.should('be.visible');
		if (clear) {
			field.clear({ force: true });
		}
		field.type(presetName, { delay: 0, force: true });
	});
}

/** Closes the visible preset edit popover (Escape). */
export function closeVisibleGlobalStylesPresetPopover() {
	cy.realPress('Escape');
}

/**
 * Asserts preset taxonomy tree visibility (`data-test="preset-taxonomy-tree"`).
 *
 * @param {{ visible?: boolean }} [options]
 */
export function assertPresetTaxonomyTreeVisible({ visible = true } = {}) {
	if (visible) {
		cy.getByDataTest('preset-taxonomy-tree', { timeout: 20000 }).should(
			'be.visible'
		);
		return;
	}
	cy.getByDataTest('preset-taxonomy-tree').should('not.exist');
}

/**
 * Asserts a taxonomy group shell label exists or not (`data-test="preset-taxonomy-group-shell"`).
 *
 * @param {string} groupLabel Group header label.
 * @param {{ exists?: boolean }} [options]
 */
export function assertPresetTaxonomyGroupShell(
	groupLabel,
	{ exists = true } = {}
) {
	const chain = cy.contains(
		'[data-test="preset-taxonomy-group-shell"]',
		groupLabel
	);
	if (exists) {
		chain.should('exist');
		return;
	}
	chain.should('not.exist');
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
	return activateMuPlugin({
		pluginPath: E2E_GLOBAL_STYLES_READ_ONLY_MU,
		pluginName: E2E_GLOBAL_STYLES_READ_ONLY_MU_NAME,
	});
}

export function deactivateGlobalStylesReadOnlyE2eFixture() {
	return deactivateMuPlugin({
		pluginPath: E2E_GLOBAL_STYLES_READ_ONLY_MU,
		pluginName: E2E_GLOBAL_STYLES_READ_ONLY_MU_NAME,
	});
}

/**
 * Asserts core-data reports no update permission on the current global styles entity.
 *
 * @return {Cypress.Chainable} Cypress chain after the assertion runs in the editor window.
 */
export function expectGlobalStylesEntityUpdateForbidden() {
	return cy.window().then((win) => {
		const { select } = getCoreDataStoreApis(win);
		const recordId = getGlobalStylesIdFromStore({ select });

		expect(recordId, 'global styles entity id').to.exist;

		expect(
			select.canUser('update', {
				kind: GLOBAL_STYLES_KIND,
				name: GLOBAL_STYLES_NAME,
				id: recordId,
			}),
			'canUser( update, globalStyles )'
		).to.equal(false);
	});
}

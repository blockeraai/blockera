/**
 * Cypress helpers for preset variables summary row (count + grouped/list view).
 */

import { getScopedStorageKey, removeScopedStorageKeys } from './storage';

export const PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY =
	'blockera-variables-view-mode';

/**
 * Variable picker portals the summary row into `var-picker-summary-slot` below search.
 * Prefer that row over legacy per-section summary rows in the catalog fallback path.
 *
 * Uses scoped selectors (not `body`) so callers work inside `.within(popover)`.
 *
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getPresetVariablesSummaryRow() {
	return cy
		.get(
			'[data-test="var-picker-summary-slot"] [data-test="preset-variables-summary-row"], [data-test="preset-variables-summary-row"]',
			{ timeout: 20000 }
		)
		.first();
}

/**
 * @param {'grouped'|'list'} mode
 */
export function setPresetVariablesViewMode(mode) {
	getPresetVariablesViewModeSelect()
		.find('select')
		.select(mode, { force: true });
}

/**
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getPresetVariablesViewModeSelect() {
	return getPresetVariablesSummaryRow().find(
		'[data-test="preset-variables-view-mode-select"]',
		{ timeout: 20000 }
	);
}

/**
 * @param {boolean} visible
 */
export function expectPresetVariablesViewModeSelectVisible(visible) {
	const chain = getPresetVariablesViewModeSelect();
	if (visible) {
		chain.should('be.visible');
		return;
	}
	chain.should('not.exist');
}

export function expectPresetTaxonomyGroupedVisible() {
	cy.getByDataTest('preset-taxonomy-group-shell', {
		timeout: 20000,
	}).should('be.visible');
}

export function expectPresetTaxonomyGroupedHidden() {
	cy.getByDataTest('preset-taxonomy-group-shell').should('not.exist');
}

/**
 * @param {number} count
 */
export function expectPresetVariablesCount(count) {
	getPresetVariablesSummaryRow()
		.find('[data-test="preset-variables-count"]')
		.should('contain.text', String(count));
}

/**
 * Clears persisted view mode before scenarios that need default grouped UI.
 */
export function clearPresetVariablesViewModeStorage() {
	cy.window().then((win) => {
		removeScopedStorageKeys(
			win.localStorage,
			PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY
		);
	});
}

/**
 * @param {'grouped'|'list'} mode
 */
export function expectPresetVariablesViewModeStorage(mode) {
	cy.window().then((win) => {
		expect(
			win.localStorage.getItem(
				getScopedStorageKey(win, PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY)
			)
		).to.eq(mode);
	});
}

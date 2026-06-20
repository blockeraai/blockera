/**
 * Cypress helpers for preset variables summary row (count + grouped/list view).
 */

export const PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY =
	'blockera-variables-view-mode';

/**
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getPresetVariablesSummaryRow() {
	return cy.getByDataTest('preset-variables-summary-row', { timeout: 20000 });
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
	return cy.getByDataTest('preset-variables-view-mode-select', {
		timeout: 20000,
	});
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
	cy.getByDataTest('preset-variables-count', { timeout: 20000 }).should(
		'contain.text',
		String(count)
	);
}

/**
 * Clears persisted view mode before scenarios that need default grouped UI.
 */
export function clearPresetVariablesViewModeStorage() {
	cy.window().then((win) => {
		win.localStorage.removeItem(PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY);
	});
}

/**
 * @param {'grouped'|'list'} mode
 */
export function expectPresetVariablesViewModeStorage(mode) {
	cy.window().then((win) => {
		expect(
			win.localStorage.getItem(PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY)
		).to.eq(mode);
	});
}

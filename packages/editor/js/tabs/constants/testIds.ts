/**
 * Stable `test-id` values for Blockera workspace tabs (Cypress: `cy.getByTestId`).
 * Imported by Cypress via webpack alias `blockera-editor-tabs-test-ids`
 * (see `packages/dev-cypress/js/webpack.config.js`).
 */
export const WORKSPACE_TABS_TEST_ID = {
	/** Primary "Add tab" control in the main tabs bar. */
	add: 'blockera-workspace-tabs-add',
	/** Root wrapper for a single tab (includes `post-123` style keys). */
	tabRoot: (tabKey: string): string => `blockera-workspace-tab--${tabKey}`,
	/** Visible title label inside a tab. */
	tabTitle: 'blockera-workspace-tabs-tab-title',
	/** Close control for an unpinned tab. */
	close: (tabKey: string): string =>
		`blockera-workspace-tabs-close--${tabKey}`,
} as const;

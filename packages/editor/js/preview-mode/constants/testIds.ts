/**
 * Stable `test-id` values for Blockera preview mode (Cypress: `cy.getByTestId`).
 * Imported by Cypress via webpack alias `blockera-editor-preview-test-ids`
 * (see `packages/dev-cypress/js/webpack.config.js`).
 */
export const PREVIEW_MODE_TEST_ID = {
	/** Header control that toggles the in-editor preview overlay. */
	toggleButton: 'blockera-preview-mode-toggle',
	/** Root overlay (`role="dialog"`) containing the preview iframe. */
	overlay: 'blockera-preview-mode-overlay',
	/** The preview iframe (frontend URL with admin bar hidden). */
	iframe: 'blockera-preview-mode-iframe',
	/** Close control in the preview header bar. */
	close: 'blockera-preview-mode-close',
	/** Reload preview iframe. */
	reload: 'blockera-preview-mode-reload',
	/** Open current preview URL in a new browser tab. */
	openInNewTab: 'blockera-preview-mode-open-in-new-tab',
} as const;

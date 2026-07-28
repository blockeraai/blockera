/**
 * Stable `data-test` values for FeatureWrapper (Cypress: `cy.getByDataTest`).
 * Imported by Cypress via webpack alias `blockera-controls-feature-wrapper-test-ids`.
 */
export const FEATURE_WRAPPER_TEST_ID = {
	root: (type) => `feature-wrapper-${type}`,
	companionNotice: 'feature-wrapper__notice__icons',
	companionModal: 'feature-wrapper-companion-modal',
	companionClose: 'feature-wrapper-companion-close',
	companionInstall: 'feature-wrapper-companion-install',
	companionInstallProgress: 'feature-wrapper-companion-install-progress',
	companionInstallError: 'feature-wrapper-companion-install-error',
	companionReloadDialog: 'feature-wrapper-companion-reload-dialog',
	companionReloadCancel: 'feature-wrapper-companion-reload-cancel',
	companionReloadDiscard: 'feature-wrapper-companion-reload-discard',
	companionReloadSave: 'feature-wrapper-companion-reload-save',
	companionReloadCountdown: 'feature-wrapper-companion-reload-countdown',
	companionReloadNow: 'feature-wrapper-companion-reload-now',
};

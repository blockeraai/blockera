import { goTo } from '@blockera/dev-cypress/js/helpers';

describe('Opt-in Telemetry', () => {
	beforeEach(() => {
		goTo('/wp-admin/admin.php?page=blockera-settings-dashboard');
		cy.window().then((win) => {
			win.blockeraOptInStatus = undefined;
		});
	});

	it('should show opt-in popup while after dashboard page is loaded', () => {
		// Verify popup is shown
		cy.getByDataTest('thank-you-heading').should('be.visible');
	});

	it('should while clicking on allow and continue button opt-in status should be set to ALLOW and close modal', () => {
		cy.getByDataTest('allow-and-continue').click();
		cy.getByDataTest('thank-you-heading').should('not.exist');
	});

	it('should while clicking on skip and continue button opt-in status should be set to SKIP and close popup', () => {
		cy.getByDataTest('skip-and-continue').click();
		cy.getByDataTest('thank-you-heading').should('not.exist');
	});
});

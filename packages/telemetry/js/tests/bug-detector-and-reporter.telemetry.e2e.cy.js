import { createPost, appendBlocks } from '@blockera/dev-cypress/js/helpers';

describe('Bug Detector and Reporter', () => {
	beforeEach(() => {
		createPost();
	});

	it('should display notice on size block section and it can be reporting automatically error', () => {
		appendBlocks(`<!-- wp:heading {"blockeraPropsId":"23bc4b3e-91cf-4bed-860e-a40e8ded86dc","blockeraCompatId":"028212413535","blockeraInnerBlocks":{"value":{"elements/link":{"attributes":{"blockeraFontColor":"#ff5252"}}}},"blockeraFontColor":{"value": {"akbar": true}},"className":"blockera-block blockera-block-was3wx","style":{"color":{"text":"#ff5252"},"elements":{"link":{"color":{"text":"#ff5252"}}}}} -->
<h2 class="wp-block-heading blockera-block blockera-block-was3wx has-text-color has-link-color" style="color:#ff5252">Bug Detector And Bug Reporter System</h2>
<!-- /wp:heading -->`);

		cy.getBlock('core/heading').first().click();

		cy.get('button', { timeout: 20000 })
			.contains('Typography')
			.closest('.is-opened')
			.as('reportBugContainer');

		cy.get('@reportBugContainer').within(() => {
			cy.getByDataTest('report-bug').click();
		});

		cy.getByDataTest('bug-detector-and-reporter-popup').should(
			'be.visible'
		);

		cy.getByDataTest('bug-detector-and-reporter-popup')
			.get('input[type="checkbox"]')
			.as('checkbox');

		cy.get('@checkbox').should('be.checked');

		// Submit report
		cy.getByDataTest('send-report-automatically').should('not.be.disabled');

		cy.get('@checkbox').click({ multiple: true, force: true });

		cy.getByDataTest('send-report-automatically').should('be.disabled');

		cy.get('@checkbox').click({ multiple: true, force: true });

		cy.intercept('POST', '**/telemetry/opt-in').as('register');
		cy.intercept('POST', '**/telemetry/log-error/status').as(
			'reportStatus'
		);
		cy.intercept('POST', '**/telemetry/log-error').as('report');

		cy.getByDataTest('send-report-automatically').click();

		cy.getByDataTest('blockera-loading-text').should('be.visible');

		cy.wait(['@register', '@reportStatus', '@report']).then(() => {
			cy.getByDataTest('successfully-reported-bug').should('be.visible');
		});
	});
});

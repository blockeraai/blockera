/**
 * Internal dependencies
 */
import './commands';
import { disableGutenbergFeatures, goTo, loginToSite } from '../helpers';

/**
 * External dependencies
 */
import 'cypress-real-events';
import '@cypress/code-coverage/support';

beforeEach(function () {
	// run these tests as if in a desktop
	// browser with a 720p monitor
	cy.viewport(1280, 720);

	cy.login();

	goTo('/wp-admin/post-new.php?post_type=post').then(() => {
		// eslint-disable-next-line
		cy.wait(2000);
		disableGutenbergFeatures();
	});
});

Cypress.Commands.add('login', () => {
	cy.session([Cypress.env('wpUsername'), Cypress.env('wpPassword')], () => {
		loginToSite();
	});
});

Cypress.Commands.add('getIframeBody', () => {
	// get the iframe > document > body
	// and retry until the body element is not empty
	// wraps "body" DOM element to allow
	// chaining more Cypress commands, like ".find(...)
	return cy.get('iframe[name="editor-canvas"]').its('0.contentDocument.body');
});

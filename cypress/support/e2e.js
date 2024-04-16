/**
 * Internal dependencies
 */
import './commands';
import { loginToSite, createPost } from '../helpers';

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


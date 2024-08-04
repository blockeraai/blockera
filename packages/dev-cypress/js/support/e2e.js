/**
 * Internal dependencies
 */
import { registerCommands } from './commands';
import { loginToSite, goTo } from '../helpers';

/**
 * External dependencies
 */
import 'cypress-real-events';
import '@cypress/code-coverage/support';

registerCommands();

beforeEach(function () {
	// run these tests as if in a desktop
	// browser with a 720p monitor
	cy.viewport(1280, 720);

	cy.login();
});

Cypress.Commands.add('login', (user = '', pass = '') => {
	if (user && pass) {
		cy.session([user, pass], () => {
			loginToSite(user, pass);
		});

		return;
	}

	cy.session([Cypress.env('wpUsername'), Cypress.env('wpPassword')], () => {
		loginToSite();
	});
});

Cypress.Commands.add('logout', () => {
	goTo('/wp-login.php?loggedout=true&wp_lang=en_US', true).then(() => {
		// Clear all sessions saved on the backend, including cached global sessions.
		Cypress.session.clearAllSavedSessions();
	});
});

Cypress.Commands.add('addNewUser', (user, pass, role) => {
	goTo('/wp-admin/users.php').then(() => {
		cy.get('a').contains('Add New User').as('@addUser');
		cy.get('@addUser').then(() => {
			cy.get('@addUser').click();
			cy.wait(1000);

			cy.get('input[name="user_login"').type(user);
			cy.get('input[name="email"').type(user + '@' + user + '.com');
			cy.get('input[aria-describedby="pass-strength-result"]').type(pass);
			cy.get('label')
				.contains('Send the new user an email about their account')
				.click();
			cy.get('select[name="role"]').select(role);

			cy.get('input[value="Add New User"]').click();
		});
	});
});

Cypress.Commands.add('getIframeBody', () => {
	// get the iframe > document > body
	// and retry until the body element is not empty
	// wraps "body" DOM element to allow
	// chaining more Cypress commands, like ".find(...)
	return cy.get('iframe[name="editor-canvas"]').its('0.contentDocument.body');
});

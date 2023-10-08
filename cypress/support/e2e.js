/**
 * Internal dependencies
 */
import './commands';
import { disableGutenbergFeatures, goTo, loginToSite } from '../helpers';

/**
 * External dependencies
 */
import '@cypress/code-coverage/support';

before(function () {
	loginToSite().then(() => {
		// FIXME: Decide whether to activate this mod manually or not
		// goTo('/wp-admin/plugins.php', true).then(() => {
		// 	// eslint-disable-next-line
		// 	cy.wait(2000);
		//
		// 	cy.get('#activate-publisher-core').click();
		// });

		goTo('/wp-admin/post-new.php?post_type=post').then(() => {
			// eslint-disable-next-line
			cy.wait(2000);
			disableGutenbergFeatures();
		});
	});
});

Cypress.Commands.add('getIframeBody', () => {
	// get the iframe > document > body
	// and retry until the body element is not empty
	return (
		cy
			.get('iframe[name="editor-canvas"]')
			.its('0.contentDocument.body')
			.should('not.be.empty')
			// wraps "body" DOM element to allow
			// chaining more Cypress commands, like ".find(...)"
			// https://on.cypress.io/wrap
			.then(cy.wrap)
	);
});

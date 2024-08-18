/**
 * Blockera dependencies
 */
import { goTo } from '@blockera/dev-cypress/js/helpers';

describe('Freemius → Opt-in Form After Plugin Activation', () => {
	it('The opt-in form should be available + Skip button', () => {
		//
		// Assert the opt-in form on the settings page
		//
		goTo('/wp-admin/admin.php?page=blockera-settings');

		cy.get('button[type="submit"]').contains('Allow & Continue');

		cy.get('a#skip_activation').should('exist');

		//
		// Skip the opt-in and check the opt-in notice on dashboard
		//
		goTo('/wp-admin/edit.php', true);

		cy.get('.fs-notice.fs-slug-blockera').should('exist');

		//
		// Dismiss the notice
		//
		cy.get('.fs-notice.fs-slug-blockera').within(() => {
			// should dismissible
			cy.get('.fs-close').should('exist');

			cy.get('.fs-close').click();
		});

		cy.wait(5000); // wait to complete the ajax request of the dismiss notice

		cy.get('.fs-notice.fs-slug-blockera').should('not.exist');

		goTo('/wp-admin/edit.php?post_type=page', true);

		cy.get('.fs-notice.fs-slug-blockera').should('not.exist');

		//
		// Skip the opt-in and check Blockera settings panel
		//
		goTo('/wp-admin/admin.php?page=blockera-settings');
		cy.get('a#skip_activation').should('exist');

		cy.get('a#skip_activation').click();

		cy.get('#blockera-admin-settings-container').should('exist');
	});
});

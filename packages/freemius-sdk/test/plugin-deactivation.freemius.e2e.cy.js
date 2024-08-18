/**
 * Blockera dependencies
 */
import { goTo } from '@blockera/dev-cypress/js/helpers';

describe('Freemius → Plugin Deactivation Feedback Form', () => {
	it('Try to deactivate plugin and check the deactivation form', () => {
		goTo('/wp-admin/plugins.php', true);

		cy.get('tr[data-slug="blockera"]').within(() => {
			cy.getByAriaLabel('Deactivate Blockera').click();
		});

		cy.get('.fs-modal.fs-modal-deactivation-feedback').should('be.visible');
	});
});

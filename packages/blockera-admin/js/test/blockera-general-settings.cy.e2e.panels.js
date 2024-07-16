import {
	createPost,
	goTo,
} from '@blockera/dev-cypress/js/helpers/site-navigation';
import {
	appendBlocks,
	resetPanelSettings,
} from '@blockera/dev-cypress/js/helpers';

describe('General Settings Testing ...', () => {
	beforeEach(() => {
		goTo('/wp-admin/admin.php?page=blockera-settings-general-settings');
	});

	it('should not display PRO hints and promotion when add secondary background if user disables it', () => {
		resetPanelSettings(true);

		cy.get(
			'div[aria-label="Opt out of PRO hints and promotions"] input'
		).click();

		cy.get(
			'div[aria-label="Opt out of PRO hints and promotions"] input'
		).should('be.checked');

		cy.getByDataTest('update-settings').as('update');

		cy.get('@update').then(() => {
			cy.get('@update').click({ force: true });
			cy.wait(3000);

			createPost();

			appendBlocks(`<!-- wp:paragraph /-->`);

			cy.getBlock('core/paragraph').click();

			cy.getByAriaLabel('Add New Background').click();
			cy.getByAriaLabel('Add New Background').click();

			cy.get('.blockera-component-promotion-popover').should('not.exist');
		});
	});

	it('should display/hidden PRO hints and promotion when add secondary background', () => {
		cy.get(
			'div[aria-label="Opt out of PRO hints and promotions"] input'
		).click();

		cy.get(
			'div[aria-label="Opt out of PRO hints and promotions"] input'
		).should('not.be.checked');

		cy.getByDataTest('update-settings').as('update');

		cy.get('@update').then(() => {
			cy.get('@update').click({ force: true });

			cy.wait(3000);

			createPost();

			appendBlocks(`<!-- wp:paragraph /-->`);

			cy.getBlock('core/paragraph').click();

			cy.getByAriaLabel('Add New Background').click();
			cy.getByAriaLabel('Add New Background').click();

			cy.get('.blockera-component-promotion-popover').should('exist');
		});
	});
});

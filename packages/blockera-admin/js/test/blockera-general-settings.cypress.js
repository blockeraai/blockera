import {
	createPost,
	goTo,
} from '@blockera/dev-cypress/js/helpers/site-navigation';
import { appendBlocks, resetAll } from '@blockera/dev-cypress/js/helpers';

describe('General Settings Testing ...', () => {
	beforeEach(() => {
		goTo('/wp-admin/admin.php?page=blockera-settings-general-settings');
	});

	it('should display/hidden PRO hints and promotion when add secondary background', () => {
		resetAll();

		cy.get(
			'div[aria-label="Opt out of PRO hints and promotions"] input'
		).click();

		cy.getByDataTest('update-settings').as('update');
		cy.get('@update').then(() => {
			cy.get('@update').click();
			cy.wait(2000);

			createPost();

			appendBlocks(`<!-- wp:paragraph /-->`);

			cy.getBlock('core/paragraph').click();

			cy.getByAriaLabel('Add New Background').click();
			cy.getByAriaLabel('Add New Background').click();

			cy.getByDataTest('popover-body').should('not.exist');
		});
	});

	it('should display/hidden PRO hints and promotion when add secondary background', () => {
		cy.get(
			'div[aria-label="Opt out of PRO hints and promotions"] input'
		).click();

		cy.getByDataTest('update-settings').as('update');
		cy.get('@update').then(() => {
			cy.get('@update').click();
			cy.wait(2000);

			createPost();

			appendBlocks(`<!-- wp:paragraph /-->`);

			cy.getBlock('core/paragraph').click();

			cy.getByAriaLabel('Add New Background').click();
			cy.getByAriaLabel('Add New Background').click();

			cy.getByDataTest('popover-body').contains('Upgrade to PRO');
		});
	});
});

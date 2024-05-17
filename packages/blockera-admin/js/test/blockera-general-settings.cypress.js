import {
	createPost,
	goTo,
} from '@blockera/dev-cypress/js/helpers/site-navigation';
import {
	appendBlocks,
	getBlockeraEntity,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers/editor';

describe('General Settings Testing ...', () => {
	beforeEach(() => {
		goTo('/wp-admin/admin.php?page=blockera-settings-general-settings');
	});

	it('should display/hidden PRO hints and promotion when add secondary background', () => {
		cy.getByDataTest('toggleProHints').click();

		cy.getByDataTest('update-settings').as('update');
		cy.get('@update').then(() => {
			cy.get('@update').click();
			cy.wait(2000);

			createPost();

			appendBlocks(`<!-- wp:paragraph /-->`);

			cy.getBlock('core/paragraph').click();

			cy.getByAriaLabel('Add New Background').click();
			cy.getByAriaLabel('Add New Background').click();

			//assert data
			getWPDataObject().then((data) => {
				const {
					general: { disableProHints },
				} = getBlockeraEntity(data, 'settings');

				if (disableProHints) {
					cy.getByDataTest('popover-body').should('not.exist');
				} else {
					cy.getByDataTest('popover-body').contains('Upgrade to PRO');
				}
			});
		});
	});
});

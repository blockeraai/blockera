/**
 * Blockera dependencies
 */
import { goTo, createPost } from '@blockera/dev-cypress/js/helpers';

describe('Breakpoints Functionalities', () => {
	beforeEach(() => {
		goTo('/wp-admin/admin.php?page=blockera-settings-general-settings');

		cy.getByDataTest('update-settings').as('update');
	});

	it('should can not add new or delete breakpoint', () => {
		cy.getByDataTest('add-new-breakpoint').click();

		cy.get('.components-popover')
			.eq(0)
			.within(() => {
				cy.get('a').contains('Upgrade to PRO').should('be.visible');

				cy.getByAriaLabel('Close').should('be.visible').click();
			});

		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').realHover();

		cy.getByAriaLabel('Delete tablet').should('not.exist');
	});

	it('should disable tablet breakpoint of top header navigation menu', () => {
		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').within(() => {
			cy.get('input').click();
		});

		cy.get('@update').then(() => {
			cy.get('@update').click();
			cy.wait(2000);
		});
		createPost();

		cy.getByAriaLabel('Breakpoints').eq(0).should('be.visible');
		cy.getByAriaLabel('Breakpoints')
			.eq(0)
			.within(() => {
				cy.getByAriaLabel('Tablet').should('not.exist');
			});
	});

	it('should allow changing breakpoint min and max width', () => {
		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').within(() => {
			cy.get('input').click();
		});
		cy.getByDataTest('tablet').click();

		// Assert control value.
		cy.getParentContainer('Size').within(() => {
			cy.getParentContainer('Min Width').within(() => {
				cy.get('input').clear();
				cy.get('input').type('768', { delay: 0 });
				cy.get('input').should('have.value', '768');
			});

			cy.getParentContainer('Max Width').within(() => {
				cy.get('input').clear();
				cy.get('input').type('1024', { delay: 0 });
				cy.get('input').should('have.value', '1024');
			});
		});

		cy.get('@update').then(() => {
			cy.get('@update').click();
			cy.wait(2000);
		});

		cy.reload();

		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').click();

		// Assert control value.
		cy.getParentContainer('Size').within(() => {
			cy.getParentContainer('Min Width').within(() => {
				cy.get('input').should('have.value', '768');
				cy.get('input').clear();
				cy.get('input').should('have.value', '');
			});

			cy.getParentContainer('Max Width').within(() => {
				cy.get('input').clear();
				cy.get('input').type('991', { delay: 0 });
				cy.get('input').should('have.value', '991');
			});
		});

		cy.get('@update').then(() => {
			cy.get('@update').click();
			cy.wait(2000);
		});
	});

	it('should allow changing breakpoint icon with default icons', () => {
		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').click();

		cy.getParentContainer('Icon').within(() => {
			cy.get('button').click();
			cy.get('div[role="listbox"')
				.contains('Mobile Portrait')
				.click({ force: true });
		});
	});

	// @debug-ignore
	it.skip('should allow changing breakpoint icon with custom icon field', () => {
		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').click();

		cy.get('.components-popover').eq(1).should('be.visible');
		cy.get('.components-popover')
			.eq(1)
			.within(() => {
				cy.getParentContainer('Icon').within(() => {
					cy.get('button').click();
					cy.get('div[role="listbox"').contains('Custom').click();
					cy.getByAriaLabel('Icon Library').click({ force: true });
				});
			});

		cy.get('.components-popover').eq(2).should('be.visible');
		cy.get('.components-popover')
			.eq(2)
			.within(() => {
				cy.getByAriaLabel('add-card Icon').should('be.visible');
				cy.getByAriaLabel('add-card Icon').click();
			});
	});
});

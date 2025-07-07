/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

describe('Breakpoints Functionalities', () => {
	beforeEach(() => {
		createPost();
	});

	it('should render breakpoints settings', () => {
		cy.getByDataTest('blockera-breakpoints-settings-opener').should(
			'be.visible'
		);

		cy.getByDataTest('blockera-breakpoints-settings-opener').click();

		cy.getByDataTest('add-new-breakpoint').should('be.visible');
	});

	it('should can not add new or delete breakpoint', () => {
		cy.getByDataTest('blockera-breakpoints-settings-opener').click();

		cy.getByDataTest('add-new-breakpoint').should('be.visible');

		cy.getByDataTest('add-new-breakpoint').click();

		cy.get('.components-popover')
			.eq(1)
			.within(() => {
				cy.get('a').contains('Upgrade to PRO').should('be.visible');

				cy.getByAriaLabel('Close').should('be.visible').click();
			});

		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').realHover();

		cy.getByAriaLabel('Delete tablet').should('be.visible');
		cy.getByAriaLabel('Delete tablet').click();

		cy.get('.components-popover').eq(1).should('be.visible');
		cy.get('.components-popover')
			.eq(1)
			.within(() => {
				cy.get('a').contains('Upgrade to PRO').should('be.visible');
			});
	});

	it('should disable tablet breakpoint of top header navigation menu', () => {
		cy.getByDataTest('blockera-breakpoints-settings-opener').click();

		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').within(() => {
			cy.get('input').click();
		});

		cy.getByAriaLabel('Breakpoints').eq(0).should('be.visible');
		cy.getByAriaLabel('Breakpoints')
			.eq(0)
			.within(() => {
				cy.getByAriaLabel('Tablet').should('not.exist');
			});

		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').within(() => {
			cy.get('input').click();
		});

		cy.getByAriaLabel('Breakpoints').eq(0).should('be.visible');
		cy.getByAriaLabel('Breakpoints')
			.eq(0)
			.within(() => {
				cy.getByAriaLabel('Tablet').should('exist');
			});
	});

	it('should allow changing breakpoint min and max width', () => {
		cy.getByDataTest('blockera-breakpoints-settings-opener').click();

		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').click();

		cy.get('.components-popover').eq(1).should('be.visible');
		cy.get('.components-popover')
			.eq(1)
			.within(() => {
				// Assert control value.
				cy.getParentContainer('Size').within(() => {
					cy.getParentContainer('Min').within(() => {
						cy.get('input').clear();
						cy.get('input').type('768', { delay: 0 });
						cy.get('input').should('have.value', '768');
					});

					cy.getParentContainer('Max').within(() => {
						cy.get('input').clear();
						cy.get('input').type('1024', { delay: 0 });
						cy.get('input').should('have.value', '1024');
					});
				});
			});

		cy.reload();

		cy.getByDataTest('blockera-breakpoints-settings-opener').click();

		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').click();

		cy.get('.components-popover').eq(1).should('be.visible');
		cy.get('.components-popover')
			.eq(1)
			.within(() => {
				// Assert control value.
				cy.getParentContainer('Size').within(() => {
					cy.getParentContainer('Min').within(() => {
						cy.get('input').should('have.value', '768');
					});

					cy.getParentContainer('Min').within(() => {
						cy.get('input').clear();
						cy.get('input').type('768', { delay: 0 });
					});

					cy.getParentContainer('Max').within(() => {
						cy.get('input').clear();
						cy.get('input').type('991', { delay: 0 });
						cy.get('input').should('have.value', '991');
					});
				});
			});
	});

	it('should allow changing breakpoint icon', () => {
		cy.getByDataTest('blockera-breakpoints-settings-opener').click();

		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').click();

		cy.get('.components-popover').eq(1).should('be.visible');
		cy.get('.components-popover')
			.eq(1)
			.within(() => {
				cy.getParentContainer('Icon').within(() => {
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

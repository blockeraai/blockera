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
});

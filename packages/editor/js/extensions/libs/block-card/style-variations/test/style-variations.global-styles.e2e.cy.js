import {
	savePage,
	openSiteEditor,
	getWPDataObject,
	closeWelcomeGuide,
	redirectToFrontPage,
	getSelectedBlockStyle,
} from '@blockera/dev-cypress/js/helpers';

describe('Style Variations Inside Global Styles Panel → Functionality', () => {
	beforeEach(() => {
		openSiteEditor();

		cy.openGlobalStylesPanel();

		closeWelcomeGuide();

		cy.getByDataTest('block-style-variations').eq(1).click();

		cy.get(`button[id="/blocks/core%2Fgroup"]`).click();
	});

	it('should be able to duplicate specific style variation', () => {
		cy.getByDataTest('open-default-contextmenu').click();

		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();

		cy.getByDataTest('style-default-copy').should('be.visible');

		cy.getByDataTest('open-default-copy-contextmenu').click();

		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();

		cy.getByDataTest('style-default-copy-1').should('be.visible');

		cy.getByDataTest('open-style-1-contextmenu').click();

		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();

		cy.getByDataTest('style-style-1-copy').should('be.visible');
	});
});

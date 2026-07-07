export const resetPanelSettings = (all = true) => {
	cy.getByDataTest('reset-settings').click({ force: true });

	cy.get('.blockera-component-modal').should('be.visible');

	if (all) {
		cy.getByDataTest('reset-modal-open-all').click({ force: true });
		cy.getByDataTest('reset-all-confirm-input')
			.find('input')
			.should('be.visible')
			.clear({ force: true })
			.type('reset', { force: true });
		cy.getByDataTest('reset-all-settings').click({ force: true });
	} else {
		cy.getByDataTest('reset-current-tab-settings').click({
			force: true,
		});
	}

	cy.get('.blockera-component-modal', { timeout: 15000 }).should('not.exist');
};

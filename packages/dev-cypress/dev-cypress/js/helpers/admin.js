export const resetPanelSettings = (all = true) => {
	cy.getByDataTest('reset-settings').click({ force: true });

	cy.get('.blockera-component-modal').should('be.visible');

	if (all) {
		cy.then(() => {
			cy.getByDataTest('reset-all-settings').click({ force: true });
		});
	} else {
		cy.then(() => {
			cy.getByDataTest('reset-current-tab-settings').click({
				force: true,
			});
		});
	}

	cy.then(() => {
		cy.wait(2000);
	});

	// reset should not return error
	cy.get('.blockera-component-modal .message.update-failed').should(
		'not.exist'
	);
};

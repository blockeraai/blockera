export const resetAll = () => {
	cy.getByDataTest('reset-settings')
		.click()
		.then(() => {
			cy.getByDataTest('reset-all-settings').click();
			cy.wait(1000);
		});
};

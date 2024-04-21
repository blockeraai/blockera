export function addBlockState(state) {
	cy.getByAriaLabel('Blockera Block State Container').first().as('states');

	cy.get('@states').within(() => {
		cy.getByAriaLabel('Add New State').click();
	});

	cy.get('.components-popover')
		.last()
		.within(() => {
			cy.getParentContainer('State').within(() => {
				cy.get('select').select(state);
			});
		});
}

export function setBlockState(state) {
	cy.getByAriaLabel('Blockera Block State Container')
		.first()
		.within(() => {
			cy.getByDataCy('group-control-header')
				.contains(state)
				.click({ force: true });
		});
}

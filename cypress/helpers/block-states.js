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

export const checkCurrentState = (id) => {
	cy.getByAriaLabel('Blockera Block State Container')
		.first()
		.within(() => {
			// selected repeater item
			cy.get(`[data-id="${id}"]`).within(() => {
				cy.getByDataCy('control-group').should(
					'have.class',
					'is-selected-item'
				);
			});
		});
};

export const checkBlockCard = (labels) => {
	labels.forEach((label) => {
		// should exist and have correct order
		cy.getByAriaLabel(`${label.label} ${label.type}`).should(
			'have.text',
			label.label
		);
	});
};

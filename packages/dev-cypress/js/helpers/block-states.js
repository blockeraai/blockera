export function addBlockState(state) {
	cy.getByAriaLabel('Blockera Block State Container').last().as('states');

	cy.get('@states').within(() => {
		cy.getByDataTest('add-new-block-state').click({ force: true });
	});

	cy.get('body').then(($body) => {
		if (!$body.find(`.blockera-component-popover`).length) {
			cy.getByDataTest('add-new-block-state').click({ force: true });
		}
	});

	cy.get('.blockera-component-popover')
		.last()
		.within(() => {
			cy.getByAriaLabel(state).click({ force: true });
		});
}

export function openInserter() {
	cy.getByDataTest('add-new-block-state').click();
}

export function setBlockState(state) {
	cy.getByAriaLabel('Blockera Block State Container')
		.last()
		.within(() => {
			cy.getByDataCy('group-control-header')
				.contains(state)
				.click({ force: true });
		});
}

export const checkCurrentState = (id) => {
	cy.getByDataTest('blockera-block-state-container')
		.last()
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

// blockCard = 'inner-block' or 'master-block'
export const checkBlockCard = (labels, blockCard = 'master-block') => {
	cy.get('.blockera-extension-block-card')
		.eq(blockCard === 'master-block' ? 0 : 1)
		.within(() => {
			labels.forEach((label) => {
				// should exist and have correct order
				cy.getByAriaLabel(label.label).should('have.text', label.text);
			});
		});
};

/**
 * Set a box spacing side value
 *
 * @param {string}  side   	Name of the panel to open
 * @param {string}  value   The value to type
 */
export function setBoxSpacingSide(side, value) {
	openBoxSpacingSide(side);

	cy.get('[data-wp-component="Popover"]')
		.last()
		.within(() => {
			cy.get('input[type=number]').clear({ force: true });
			cy.get('input[type=number]').clear({ force: true });
			cy.get('input[type=number]').type(value, { delay: 0, force: true });
		});
}

/**
 * Clear box spacing side value
 *
 * @param {string}  side   	Name of the panel to open
 */
export function clearBoxSpacingSide(side) {
	openBoxSpacingSide(side);

	cy.get('[data-wp-component="Popover"]')
		.last()
		.within(() => {
			cy.get('input[type=number]').clear({ force: true });
			cy.get('input[type=number]').clear({ force: true });
		});
}

/**
 * Open box spacing side popover
 *
 * @param {string}  side   Name of the panel to open
 */
export function openBoxSpacingSide(side) {
	cy.get(`[data-cy="box-spacing-${side}"] [data-cy="label-control"]`).click();
}

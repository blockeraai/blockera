/**
 * Set a box position side value
 *
 * @param {string}  side   	Name of the panel to open
 * @param {string}  value   The value to type
 */
export function setBoxPositionSide(side, value) {
	openBoxPositionSide(side);

	cy.get('[data-wp-component="Popover"]')
		.last()
		.within(() => {
			cy.get('input[type=text]').clear({ force: true });
			cy.get('input[type=text]').type(value, { delay: 0, force: true });
		});
}

/**
 * Clear box position side value
 *
 * @param {string}  side   	Name of the panel to open
 */
export function clearBoxPositionSide(side) {
	openBoxPositionSide(side);

	cy.get('[data-wp-component="Popover"]')
		.last()
		.within(() => {
			cy.get('input[type=text]').clear({ force: true });
		});
}

/**
 * Open box position side popover
 *
 * @param {string}  side   Name of the panel to open
 */
export function openBoxPositionSide(side) {
	// try to close all popovers
	cy.get('body').type('{esc}');

	cy.get(
		`[data-cy="box-position-label-${side}"] [data-cy="label-control"]`
	).click({ force: true });
}

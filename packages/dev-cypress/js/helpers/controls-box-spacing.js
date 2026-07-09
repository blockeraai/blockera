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
			cy.get('input[type=text]').clear({ force: true });
			cy.get('input[type=text]').clear({ force: true });
			cy.get('input[type=text]').type(value, { delay: 0, force: true });
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
			cy.get('input[type=text]').clear({ force: true });
			cy.get('input[type=text]').clear({ force: true });
		});
}

/**
 * Open box spacing side popover
 *
 * @param {string}  side   Name of the panel to open
 */
export function openBoxSpacingSide(side, element = 'label') {
	if (element === 'label') {
		cy.get(
			`[data-cy="box-spacing-${side}"] [data-cy="label-control"]`
		).click();
	} else if (element === 'shape') {
		cy.get(`[data-cy="box-spacing-control"]`).within(() => {
			cy.get(`path.blockera-control-spacing-shape-side.side-${side}`)
				.trigger('mouseover', { force: true })
				.trigger('mousedown', { force: true })
				.wait(100)
				.trigger('mouseup', { force: true })
				.trigger('click', { force: true });
		});
	}
}

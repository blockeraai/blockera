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
			//
			// Following code is used to click on the shape element and make sure it works
			//
			cy.get(
				`path.blockera-control-spacing-shape-side.side-${side}`
			).trigger('mousedown', 'topLeft', {
				force: true,
				which: 1,
			});
			cy.wait(100);
			cy.get(
				`path.blockera-control-spacing-shape-side.side-${side}`
			).trigger('mouseup', 'topLeft', {
				force: true,
				which: 1,
			});
			cy.get(
				`path.blockera-control-spacing-shape-side.side-${side}`
			).trigger('click', { force: true });
		});
	}
}
